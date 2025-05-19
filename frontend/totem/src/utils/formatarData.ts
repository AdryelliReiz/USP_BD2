export default function formatarData(dataStr: string) {
  // Divide a string no formato esperado "yyyy-mm-dd"
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const dataEntrada = new Date(ano, mes - 1, dia); // Meses começam em 0
  
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  // Ajusta as datas para ignorar o horário
  hoje.setHours(0, 0, 0, 0);
  amanha.setHours(0, 0, 0, 0);
  dataEntrada.setHours(0, 0, 0, 0);

  if (dataEntrada.getTime() === hoje.getTime()) {
    return "hoje";
  } else if (dataEntrada.getTime() === amanha.getTime()) {
    return "amanhã";
  } else {
    // Retorna no formato dd/mm
    return dataEntrada.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }
}
