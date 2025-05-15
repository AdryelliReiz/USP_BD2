import Link from "next/link";
import "./styles.scss";

type CardProps = {
    title: string;
    description: string;
    image: React.ReactNode;
    link: string;
}

export default function Card({
    title,
    description,
    image,
    link
}: CardProps) {
  return (
    <div className="card-container">
        <Link href={link} className="card">
            <div className="card-image">
                {image}
            </div>
            <div className="card-content">
                <h5>{title}</h5>
                <p>{description}</p>
            </div>
        </Link>
    </div>
  );
}