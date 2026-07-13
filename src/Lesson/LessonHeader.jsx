import React from "react";
import "./LessonHeader.css";

export default function LessonHeader({
  title,
  description,
  level,
  duration,
}) {
  return (
    <div className="lesson-header">
      <h1>{title}</h1>

      <p className="lesson-description">
        {description}
      </p>

      <div className="lesson-meta">
        <span>Level: {level}</span>
        <span>Estimated Time: {duration}</span>
      </div>
    </div>
  );
}