import React from "react";
import "./styles.scss";

type ReportCardProps = {
    title: string;
    content: React.ReactNode;
    idChart?: boolean
}

export default function ReportCard({ title, content, isChart }: ReportCardProps) {
    return (
        <div className="report-card-container">
            <div className="report-header">
                <h3>{title}</h3>
            </div>

            <div className={`report-content ${isChart && "is-chart"}`}>
                {content}
            </div>
        </div>
    );
}