exports.traceMessages = (code) => {
  switch (code) {
    case -1:
      return "Ocorreu um erro no servidor";
    case 0:
      return "";
    case 1:
      return "Diferente do esperado";
    case 2:
      return "Diferença nos espaços em branco. Não deveria haver nenhum espaço ou nova linha a mais nem a menos";
    case 3:
      return "Esta parte da memória deveria estar inativa";
    case 4:
      return "Esta parte da memória deveria estar ativa";
    case 5:
      return "Talvez você tenha esquecido das aspas";
    case 6:
      return "Valor de retorno incorreto";
  }
};
