export default function formatarHora(dataStr: string) {
    dataStr = dataStr.split(":").slice(0, 2).join("h");
    return dataStr;
}