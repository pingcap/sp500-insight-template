import { FormEvent, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';
import { useRefCallback } from '@/utils/hook';

interface FormProps<Data extends FieldValues> extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: Data) => void;
}

function Form<Data extends FieldValues> ({ onSubmit, children, ...props }: FormProps<Data>) {
  const methods = useForm<Data>();

  const handleSubmit = useRefCallback((event: FormEvent<HTMLFormElement>) => {
    void methods.handleSubmit(onSubmit)(event);
  });

  return (
    <form {...props} onSubmit={handleSubmit}>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </form>
  );
}

export default Form;