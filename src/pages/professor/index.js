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
  const [allProfiles, setAllProfiles] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

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

      // -----------------------------------
      // Load all user profiles for role management
      // -----------------------------------
      setIsLoadingProfiles(true);
      const { data: profilesData, error: profilesErr } = await supabase
        .from("profiles")
        .select("clerk_user_id, first_name, last_name, role")
        .order("first_name", { ascending: true });

      if (profilesErr) {
        console.error("Unable to load profiles:", profilesErr);
      } else {
        setAllProfiles(profilesData || []);
      }
      setIsLoadingProfiles(false);

      setIsLoadingStudents(false);
      setIsLoading(false);
    };

    loadProfessorData();
  }, [authLoaded, isSignedIn, user, supabase]);

  // -----------------------------------
  // Update a user's role
  // -----------------------------------

  const handleRoleChange = async (targetUserId, newRole) => {
    setRoleMessage("");
    setIsUpdatingRole(true);

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("clerk_user_id", targetUserId);

    setIsUpdatingRole(false);

    if (error) {
      setRoleMessage("Failed to update role: " + error.message);
      return;
    }

    // Update local state so dropdown & display update immediately
    setAllProfiles((prev) =>
      prev.map((u) =>
        u.clerk_user_id === targetUserId
          ? { ...u, role: newRole }
          : u
      )
    );

    setRoleMessage(
      `Role updated to "${newRole}" successfully!`
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
              Select any registered user from the dropdown to view or change their access level.
            </p>

            {isLoadingProfiles ? (
              <p>Loading users list...</p>
            ) : (
              <div>
                {/* Optional quick filter by name if the list grows */}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                    Filter list (optional):
                  </label>
                  <input
                    type="text"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    placeholder="Type to filter users..."
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      padding: "0.5rem 0.75rem",
                      borderRadius: 6,
                      border: "1px solid var(--ifm-color-emphasis-300)",
                    }}
                  />
                </div>

                {/* Dropdown selection */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                    Choose a User:
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      setSelectedUserId(e.target.value);
                      setRoleMessage("");
                    }}
                    style={{
                      width: "100%",
                      maxWidth: 450,
                      padding: "0.65rem 0.75rem",
                      borderRadius: 8,
                      border: "1px solid var(--ifm-color-emphasis-300)",
                      backgroundColor: "var(--ifm-background-color)",
                      color: "var(--ifm-font-color-base)",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="">-- Select a user --</option>
                    {allProfiles
                      .filter((u) => u.clerk_user_id !== user.id) // exclude current professor
                      .filter((u) => {
                        if (!roleFilter.trim()) return true;
                        const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
                        return fullName.includes(roleFilter.toLowerCase());
                      })
                      .map((u) => (
                        <option key={u.clerk_user_id} value={u.clerk_user_id}>
                          {u.first_name} {u.last_name || ""} — [{u.role || "student"}]
                        </option>
                      ))}
                  </select>
                </div>

                {/* Actions for selected user */}
                {selectedUserId && (() => {
                  const target = allProfiles.find((u) => u.clerk_user_id === selectedUserId);
                  if (!target) return null;
                  const isTargetProf = target.role === "professor";

                  return (
                    <div
                      style={{
                        padding: "1rem",
                        backgroundColor: "var(--ifm-color-emphasis-100)",
                        borderRadius: 8,
                        maxWidth: 450,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <strong>{target.first_name} {target.last_name || ""}</strong>
                        <div style={{ fontSize: "0.85rem", marginTop: 4 }}>
                          Current Role:{" "}
                          <span
                            style={{
                              fontWeight: 700,
                              color: isTargetProf
                                ? "var(--ifm-color-primary)"
                                : "inherit",
                            }}
                          >
                            {target.role || "student"}
                          </span>
                        </div>
                      </div>

                      <div>
                        {!isTargetProf ? (
                          <button
                            onClick={() => handleRoleChange(target.clerk_user_id, "professor")}
                            disabled={isUpdatingRole}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: 6,
                              backgroundColor: "var(--ifm-color-primary)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {isUpdatingRole ? "Updating..." : "Make Professor"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(target.clerk_user_id, "student")}
                            disabled={isUpdatingRole}
                            style={{
                              padding: "0.5rem 1rem",
                              borderRadius: 6,
                              backgroundColor: "var(--ifm-color-emphasis-500)",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {isUpdatingRole ? "Updating..." : "Make Student"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {roleMessage && (
                  <p
                    style={{
                      marginTop: "1rem",
                      fontWeight: 500,
                      color: roleMessage.includes("success")
                        ? "var(--ifm-color-success)"
                        : "var(--ifm-color-danger)",
                    }}
                  >
                    {roleMessage}
                  </p>
                )}
              </div>
            )}
          </section>

        </div>
      </main>
    </Layout>
  );
}