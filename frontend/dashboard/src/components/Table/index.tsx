import "./styles.scss";

type ITableProps = {
    columns: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Array<any[]>;
}

export default function Table({ 
    columns,
    data 
}: ITableProps) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {row.map((cell, index) => (
                            <td key={index}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}