import React, { useState } from 'react';
import { Box, Button, Form, FormField, Layer, TextInput } from 'grommet';

interface Props {
  onClose: () => void;
  onSubmit: (data: { nome: string; email: string; idade: number }) => void;
  initialValue?: { nome: string; email: string; idade: number };
}

export function UserForm({ onClose, onSubmit, initialValue }: Props) {
  const [value, setValue] = useState(initialValue || { nome: '', email: '', idade: '' });

  return (
    <Layer onEsc={onClose} onClickOutside={onClose}>
      <Box pad="medium" width="medium">
        <Form
          value={value}
          onChange={nextValue => setValue(nextValue)}
          onSubmit={({ value }) => {
            onSubmit({
              nome: value.nome,
              email: value.email,
              idade: Number(value.idade),
            });
          }}
        >
          <FormField name="nome" label="Nome" required>
            <TextInput name="nome" />
          </FormField>
          <FormField name="email" label="Email" required>
            <TextInput name="email" type="email" />
          </FormField>
          <FormField name="idade" label="Idade" required>
            <TextInput name="idade" type="number" min="0" />
          </FormField>
          <Box direction="row" gap="medium" justify="end" margin={{ top: 'medium' }}>
            <Button label="Cancelar" onClick={onClose} />
            <Button type="submit" label="Salvar" primary />
          </Box>
        </Form>
      </Box>
    </Layer>
  );
}