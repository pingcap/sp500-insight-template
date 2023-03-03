import { cloneElement, FC, ReactElement, ReactNode, useId } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import clsx from 'clsx';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';
import './FormControl.css'

export interface FormControlProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends UseControllerProps<TFieldValues, TName> {
  children: ReactElement<FormControlChildrenProps<TFieldValues, TName> & { className?: string }>;
  label?: ReactNode;
  placeholder?: string;
}

export interface FormControlChildrenProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends ControllerRenderProps<TFieldValues, TName> {
  label?: ReactNode;
  id?: string;
  placeholder?: string;
}

function FormControl<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> ({ name, rules, defaultValue, shouldUnregister, control, children, ...props }: FormControlProps<TFieldValues, TName>) {
  const { fieldState, field } = useController({ name, defaultValue, shouldUnregister, control, rules });
  const id = useId();

  return (
    <div className="form-control">
      {cloneElement(children, {
        ...field,
        ...props,
        id: `${name}-${id}`,
        className: clsx(children.props.className, {
          invalid: fieldState.invalid,
        }),
      })}
    </div>
  );
}

(FormControl as FC).displayName = 'FormControl';

export default FormControl;
