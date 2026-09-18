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
  const [classroomName, setClassroomName] = useState("");
  const [classroomCode, setClassroomCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoaded) return;

    if (!isSignedIn || !user || !supabase) {
      setIsLoading(false);
      return;
    }

    const loadProfessorData = async () => {
      setMessage("");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("clerk_user_id", user.id)
        .single();

      if (profileError) {
        console.error("Unable to load profile:", profileError);
        setMessage("Unable to load your account.");
        setIsLoading(false);
        return;
      }

      setRole(profile.role);

      if (profile.role !== "professor") {
        setIsLoading(false);
        return;
      }

      const { data: classroomData, error: classroomError } =
        await supabase
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

      setIsLoading(false);
    };

    loadProfessorData();
  }, [authLoaded, isSignedIn, user, supabase]);

  const generateCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 8; i++) {
      code += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setClassroomCode(code);
  };

  const handleCreateClassroom = async (event) => {
    event.preventDefault();

    if (!classroomName.trim()) {
      setMessage("Please enter a classroom name.");
      return;
    }

    if (!classroomCode.trim()) {
      setMessage("Please enter or generate a classroom code.");
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
        .select("id, name, code, created_at")
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

      setClassrooms((current) => [data, ...current]);
      setClassroomName("");
      setClassroomCode("");
      setMessage(
        `Classroom "${data.name}" was created successfully.`
      );
    } catch (error) {
      console.error("Classroom creation error:", error);
      setMessage(
        error?.message ||
          "Something went wrong while creating the classroom."
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (!authLoaded || isLoading) {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p>Loading...</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (!isSignedIn) {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1>Professor Dashboard</h1>
            <p>Please log in to continue.</p>
          </div>
        </main>
      </Layout>
    );
  }

  if (role !== "professor") {
    return (
      <Layout title="Professor">
        <main style={{ padding: "3rem 1rem" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1>Professor Dashboard</h1>
            <p>
              This page is available only to professor
              accounts.
            </p>
          </div>
        </main>
      </Layout>
    );
  }

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
            Welcome, {user.firstName || "Professor"}.
          </p>

          <section
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              border: "1px solid var(--ifm-color-emphasis-200)",
              borderRadius: 12,
            }}
          >
            <h2>Create a Classroom</h2>

            <form onSubmit={handleCreateClassroom}>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Classroom Name
                  <input
                    type="text"
                    value={classroomName}
                    onChange={(event) =>
                      setClassroomName(event.target.value)
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

              <div style={{ marginBottom: "1rem" }}>
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
                  style={{ marginTop: 8 }}
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
              <p style={{ marginTop: "1rem" }}>
                {message}
              </p>
            )}
          </section>

          <section style={{ marginTop: "2rem" }}>
            <h2>Your Classrooms</h2>

            {classrooms.length === 0 ? (
              <p>
                You haven't created any classrooms yet.
              </p>
            ) : (
              <div>
                {classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    style={{
                      marginBottom: "1rem",
                      padding: "1rem",
                      border:
                        "1px solid var(--ifm-color-emphasis-200)",
                      borderRadius: 10,
                    }}
                  >
                    <h3>{classroom.name}</h3>

                    <p>
                      <strong>Classroom Code:</strong>{" "}
                      {classroom.code}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}