/**
 * Retorna a idade em anos completos a partir da data de nascimento.
 * @param birthDate Date | string (ISO)
 */
export function getAge(birthDate: Date | string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Verifica se a idade é maior ou igual ao mínimo exigido.
 * @param birthDate Date | string (ISO)
 * @param minAge número mínimo de anos (ex: 18)
 */
export function isOfLegalAge(birthDate: Date | string, minAge = 18): boolean {
  return getAge(birthDate) >= minAge;
}