export function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const fileName = (target.constructor && target.constructor.name) || 'unknown';
    console.log(`[LOG] Chamando ${propertyKey} em ${fileName} com argumentos:`, args);
    try {
      const result = await originalMethod.apply(this, args);
      console.log(`[LOG] ${propertyKey} executado com sucesso em ${fileName}`);
      if (typeof result !== 'undefined') {
        console.log(`[LOG] ${propertyKey} retornou:`, result);
      }
      return result;
    } catch (error) {
      console.error(`[LOG] Erro em ${propertyKey} em ${fileName}:`, error);
      throw error;
    }
  };
  return descriptor;
}