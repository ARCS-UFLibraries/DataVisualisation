import React, { useContext, useState } from "react";
import { useUser } from "@clerk/react";
import { SupabaseContext } from "@site/src/lib/supabaseClient";
import styles from "./JoinClassroom.module.css";

export default function JoinClassroom() {
  const supabase = useContext(SupabaseContext);
  const { user } = useUser();

  const [classroomCode, setClassroomCode] = useState("");
  const [message, setMessage] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinedClassroom, setJoinedClassroom] = useState(null);

  const handleJoin = async (event) => {
    event.preventDefault();

    const code = classroomCode.trim().toUpperCase();

    if (!code) {
      setMessage("Please enter a classroom code.");
      return;
    }

    if (!supabase || !user) {
      setMessage("Your account is not ready yet. Please try again.");
      return;
    }

    setMessage("");
    setIsJoining(true);

    try {
      const { data, error } = await supabase.rpc(
        "join_classroom_by_code",
        {
          p_code: code,
        }
      );

      if (error) {
        console.error("Classroom join error:", error);
        setMessage(
          error.message || "Unable to join the classroom."
        );
        return;
      }

      const classroom = data?.[0];

      if (!classroom) {
        setMessage("The classroom could not be joined.");
        return;
      }

      setJoinedClassroom(classroom);
      setClassroomCode("");
      setMessage(
        `You joined ${classroom.classroom_name}.`
      );
    } catch (error) {
      console.error("Classroom join error:", error);
      setMessage(
        error?.message ||
          "Something went wrong while joining the classroom."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className={styles.card}>
      <h2>Join a Classroom</h2>

      <p className={styles.description}>
        Enter the classroom code provided by your professor.
      </p>

      <form onSubmit={handleJoin}>
        <input
          type="text"
          value={classroomCode}
          onChange={(event) =>
            setClassroomCode(
              event.target.value.toUpperCase()
            )
          }
          placeholder="e.g. DATA2026"
          className={styles.input}
          disabled={isJoining}
        />

        <button
          type="submit"
          className={styles.button}
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join Classroom"}
        </button>
      </form>

      {message && (
        <p
          className={
            joinedClassroom
              ? styles.success
              : styles.message
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}