import { injectable } from 'inversify';
import { CreateUserCommandHandler } from './CreateUserCommandHandler';
import fs from 'fs';
import { parse } from 'csv-parse';

@injectable()
export class ImportUsersBatchHandler {
  constructor(private createUserHandler: CreateUserCommandHandler) {}

  async execute(filePath: string) {
    const users: { nome: string; email: string; idade: number }[] = [];
    let headerValidated = false;

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', (row) => {
          if (!headerValidated) {
            const expected = ['nome', 'email', 'idade'];
            const lowerHeaders = Object.keys(row).map((h) => h.toLowerCase().trim());
            const isValid = expected.every((col) => lowerHeaders.includes(col));
            if (!isValid) {
              reject(
                new Error(
                  `Cabeçalho do CSV inválido. Esperado: ${expected.join(
                    ', '
                  )}. Encontrado: ${Object.keys(row).join(', ')}`
                )
              );
              return;
            }
            headerValidated = true;
          }
          if (row.nome && row.email && row.idade) {
            users.push({
              nome: row.nome,
              email: row.email,
              idade: Number(row.idade),
            });
          }
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });

    // Cria usuários e coleta erros
    let successCount = 0;
    let errorCount = 0;
    const errors: { nome: string; email: string; idade: number; message: string }[] = [];
    for (const user of users) {
      try {
        await this.createUserHandler.execute(user.nome, user.email, user.idade);
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push({
          ...user,
          message: err?.message || 'Erro desconhecido ao inserir usuário',
        });
      }
    }
    fs.unlinkSync(filePath);

    return { successCount, errorCount, total: users.length, errors };
  }
}