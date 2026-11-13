import React, { useContext, useEffect, useState } from "react";
import Layout from "@theme/Layout";
import { useAuth, useUser } from "@clerk/react";
import { SupabaseContext } from "@site/src/lib/supabaseClient";

export default function ProfessorPage() {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const supabase = useContext(SupabaseContext);

  const [role, setRole] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);

  const [classroomName, setClassroomName] = useState("");
  const [classroomCode, setClassroomCode] = useState("");

  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] =
    useState(false);

  // -----------------------------------
  // Manage roles state
  // -----------------------------------
  const [roleSearch, setRoleSearch] = useState("");
  const [roleResults, setRoleResults] = useState([]);
  const [roleMessage, setRoleMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!authLoaded) return;

    if (!isSignedIn || !user || !supabase) {
      setIsLoading(false);
      return;
    }

    const loadProfessorData = async () => {
      setMessage("");

      // -----------------------------------
      // Load professor profile
      // -----------------------------------

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("clerk_user_id", user.id)
          .single();

      if (profileError) {
        console.error(
          "Unable to load profile:",
          profileError
        );

        setMessage("Unable to load your account.");
        setIsLoading(false);
        return;
      }

      setRole(profile.role);

      if (profile.role !== "professor") {
        setIsLoading(false);
        return;
      }

      // -----------------------------------
      // Load professor classrooms
      // -----------------------------------

      const {
        data: classroomData,
        error: classroomError,
      } = await supabase
        .from("classrooms")
        .select("id, name, code, created_at")
        .eq("professor_id", user.id)
        .order("created_at", { ascending: false });

      if (classroomError) {
        console.error(
          "Unable to load classrooms:",
          classroomError
        );

        setMessage("Unable to load your classrooms.");
      } else {
        setClassrooms(classroomData || []);
      }

      // -----------------------------------
      // Load students
      // -----------------------------------

      setIsLoadingStudents(true);

      const {
        data: studentData,
        error: studentError,
      } = await supabase.rpc("get_professor_students");

      if (studentError) {
        console.error(
          "Unable to load students:",
          studentError
        );

        setMessage(
          "Your classrooms loaded, but the student list could not be loaded."
        );
      } else {
        setStudents(studentData || []);
      }

      setIsLoadingStudents(false);
      setIsLoading(false);
    };

    loadProfessorData();
  }, [authLoaded, isSignedIn, user, supabase]);

  // -----------------------------------
  // Search users by name (for role management)
  // -----------------------------------

  const handleRoleSearch = async (event) => {
    event.preventDefault();
    if (!roleSearch.trim()) return;

    setIsSearching(true);
    setRoleResults([]);
    setRoleMessage("");

    const term = roleSearch.trim();

    const { data, error } = await supabase
      .from("profiles")
      .select("clerk_user_id, first_name, last_name, role")
      .or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%`
      )
      .neq("clerk_user_id", user.id) // exclude yourself
      .limit(10);

    setIsSearching(false);

    if (error) {
      setRoleMessage("Search failed: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setRoleMessage("No users found matching that name.");
      return;
    }

    setRoleResults(data);
  };

  // -----------------------------------
  // Update a user's role
  // -----------------------------------

  const handleRoleChange = async (targetUserId, newRole) => {
    setRoleMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("clerk_user_id", targetUserId);

    if (error) {
      setRoleMessage("Failed to update role: " + error.message);
      return;
    }

    // Update local results so the button reflects the change immediately
    setRoleResults((prev) =>
      prev.map((u) =>
        u.clerk_user_id === targetUserId
          ? { ...u, role: newRole }
          : u
      )
    );

    setRoleMessage(
      `Role updated to "${newRole}" successfully.`
    );
  };

  // -----------------------------------
  // Generate classroom code
  // -----------------------------------

  const generateCode = () => {
    const characters =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 8; i++) {
      code += characters.charAt(
        Math.floor(
          Math.random() * characters.length
        )
      );
    }

    setClassroomCode(code);
  };

  // -----------------------------------
  // Create classroom
  // -----------------------------------

  const handleCreateClassroom = async (event) => {
    event.preventDefault();

    if (!classroomName.trim()) {
      setMessage("Please enter a classroom name.");
      return;
    }

    if (!classroomCode.trim()) {
      setMessage(
        "Please enter or generate a classroom code."
      );
      return;
    }

    setMessage("");
    setIsCreating(true);

    try {
      const { data, error } = await supabase
        .from("classrooms")
        .insert({
          name: classroomName.trim(),
          code: classroomCode.trim().toUpperCase(),
          professor_id: user.id,
        })
        .select(
          "id, name, code, created_at"
        )
        .single();

      if (error) {
        console.error(
          "Unable to create classroom:",
          error
        );

        if (error.code === "23505") {
          setMessage(
            "That classroom code is already being used. Please choose another."
          );
        } else {
          setMessage(
            error.message ||
              "Unable to create the classroom."
          );
        }

        return;
      }

      setClassrooms((current) => [
        data,
        ...current,
      ]);

      setClassroomName("");
      setClassroomCode("");

      setMessage(
        `Classroom "${data.name}" was created successfully.`
      );
    } catch (error) {
      console.error(
        "Classroom creation error:",
        error
      );

      setMessage(
        error?.message ||
          "Something went wrong while creating the classroom."
      );
    } finally {
      setIsCreating(false);
    }
  };

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (!authLoaded || isLoading) {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    );
  }

  // -----------------------------------
  // Not signed in
  // -----------------------------------

  if (!isSignedIn) {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <h1>Professor Dashboard</h1>
            <p>Please log in to continue.</p>
          </div>
        </main>
      </Layout>
    );
  }

  // -----------------------------------
  // Not a professor
  // -----------------------------------

  if (role !== "professor") {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <h1>Professor Dashboard</h1>

            <p>
              This page is available only to
              professor accounts.
            </p>
          </div>
        </main>
      </Layout>
    );
  }

  // -----------------------------------
  // Professor dashboard
  // -----------------------------------

  return (
    <Layout
      title="Professor Dashboard"
      description="Professor classroom management"
    >
      <main style={{ padding: "3rem 1rem" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <h1>Professor Dashboard</h1>

          <p>
            Welcome,{" "}
            {user.firstName || "Professor"}.
          </p>

          {/* ============================== */}
          {/* CREATE CLASSROOM */}
          {/* ============================== */}

          <section
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border:
                "1px solid var(--ifm-color-emphasis-200)",
              borderRadius: 12,
            }}
          >
            <h2>Create a Classroom</h2>

            <form
              onSubmit={handleCreateClassroom}
            >
              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <label>
                  Classroom Name

                  <input
                    type="text"
                    value={classroomName}
                    onChange={(event) =>
                      setClassroomName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Data Visualization Fall 2026"
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: 8,
                      padding: "0.75rem",
                    }}
                  />
                </label>
              </div>

              <div
                style={{
                  marginBottom: "1rem",
                }}
              >
                <label>
                  Classroom Code

                  <input
                    type="text"
                    value={classroomCode}
                    onChange={(event) =>
                      setClassroomCode(
                        event.target.value.toUpperCase()
                      )
                    }
                    placeholder="e.g. DATA2026"
                    style={{
                      display: "block",
                      width: "100%",
                      marginTop: 8,
                      padding: "0.75rem",
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={generateCode}
                  style={{
                    marginTop: 8,
                  }}
                >
                  Generate Code
                </button>
              </div>

              <button
                type="submit"
                disabled={isCreating}
              >
                {isCreating
                  ? "Creating..."
                  : "Create Classroom"}
              </button>
            </form>

            {message && (
              <p
                style={{
                  marginTop: "1rem",
                }}
              >
                {message}
              </p>
            )}
          </section>

          {/* ============================== */}
          {/* YOUR CLASSROOMS */}
          {/* ============================== */}

          <section
            style={{
              marginTop: "2rem",
            }}
          >
            <h2>Your Classrooms</h2>

            {classrooms.length === 0 ? (
              <p>
                You haven't created any
                classrooms yet.
              </p>
            ) : (
              <div>
                {classrooms.map(
                  (classroom) => {
                    const classroomStudents =
                      students.filter(
                        (student) =>
                          student.classroom_id ===
                          classroom.id
                      );

                    return (
                      <div
                        key={classroom.id}
                        style={{
                          marginBottom: "1.5rem",
                          padding: "1.25rem",
                          border:
                            "1px solid var(--ifm-color-emphasis-200)",
                          borderRadius: 10,
                        }}
                      >
                        <h3>
                          {classroom.name}
                        </h3>

                        <p>
                          <strong>
                            Classroom Code:
                          </strong>{" "}
                          {classroom.code}
                        </p>

                        <p>
                          <strong>
                            Students:
                          </strong>{" "}
                          {classroomStudents.length}
                        </p>

                        {/* Student roster */}

                        {isLoadingStudents ? (
                          <p>
                            Loading students...
                          </p>
                        ) : classroomStudents.length ===
                          0 ? (
                          <p>
                            No students have
                            joined this classroom
                            yet.
                          </p>
                        ) : (
                          <div
                            style={{
                              marginTop: "1rem",
                              overflowX: "auto",
                            }}
                          >
                            <table
                              style={{
                                width: "100%",
                                borderCollapse:
                                  "collapse",
                              }}
                            >
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      textAlign:
                                        "left",
                                      padding:
                                        "0.75rem",
                                      borderBottom:
                                        "1px solid var(--ifm-color-emphasis-200)",
                                    }}
                                  >
                                    Student
                                  </th>

                                  <th
                                    style={{
                                      textAlign:
                                        "left",
                                      padding:
                                        "0.75rem",
                                      borderBottom:
                                        "1px solid var(--ifm-color-emphasis-200)",
                                    }}
                                  >
                                    Joined
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {classroomStudents.map(
                                  (student) => (
                                    <tr
                                      key={`${student.classroom_id}-${student.student_id}`}
                                    >
                                      <td
                                        style={{
                                          padding:
                                            "0.75rem",
                                          borderBottom:
                                            "1px solid var(--ifm-color-emphasis-100)",
                                        }}
                                      >
                                        {student.first_name}{" "}
                                        {student.last_name ||
                                          ""}
                                      </td>

                                      <td
                                        style={{
                                          padding:
                                            "0.75rem",
                                          borderBottom:
                                            "1px solid var(--ifm-color-emphasis-100)",
                                        }}
                                      >
                                        {new Date(
                                          student.joined_at
                                        ).toLocaleDateString(
                                          undefined,
                                          {
                                            month:
                                              "short",
                                            day:
                                              "numeric",
                                            year:
                                              "numeric",
                                          }
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>
          {/* ============================== */}
          {/* MANAGE ROLES */}
          {/* ============================== */}

          <section
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border:
                "1px solid var(--ifm-color-emphasis-200)",
              borderRadius: 12,
            }}
          >
            <h2>Manage User Roles</h2>
            <p style={{ color: "var(--ifm-color-emphasis-600)", marginBottom: "1rem" }}>
              Search for a user by name, then promote them to professor or demote them to student.
            </p>

            <form onSubmit={handleRoleSearch} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={roleSearch}
                onChange={(e) => setRoleSearch(e.target.value)}
                placeholder="Search by first or last name…"
                style={{ flex: 1, minWidth: 200, padding: "0.75rem" }}
              />
              <button type="submit" disabled={isSearching}>
                {isSearching ? "Searching…" : "Search"}
              </button>
            </form>

            {roleMessage && (
              <p style={{ marginTop: "0.75rem" }}>{roleMessage}</p>
            )}

            {roleResults.length > 0 && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr>
                    {["Name", "Current Role", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: "left",
                          padding: "0.75rem",
                          borderBottom: "1px solid var(--ifm-color-emphasis-200)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roleResults.map((u) => (
                    <tr key={u.clerk_user_id}>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--ifm-color-emphasis-100)" }}>
                        {u.first_name} {u.last_name || ""}
                      </td>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--ifm-color-emphasis-100)" }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: u.role === "professor"
                              ? "var(--ifm-color-primary)"
                              : "inherit",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--ifm-color-emphasis-100)", display: "flex", gap: "0.5rem" }}>
                        {u.role !== "professor" && (
                          <button
                            onClick={() =>
                              handleRoleChange(u.clerk_user_id, "professor")
                            }
                          >
                            Make Professor
                          </button>
                        )}
                        {u.role !== "student" && (
                          <button
                            onClick={() =>
                              handleRoleChange(u.clerk_user_id, "student")
                            }
                          >
                            Make Student
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

        </div>
      </main>
    </Layout>
  );
}