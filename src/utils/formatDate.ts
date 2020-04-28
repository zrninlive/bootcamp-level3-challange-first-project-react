const formatDate = (value: string): string =>
  Intl.DateTimeFormat('pt').format(new Date(value));

export default formatDate;
