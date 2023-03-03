import { CSSProperties, FC, forwardRef } from 'react';
import * as Label from '@radix-ui/react-label';
import clsx from 'clsx';
import { FormControlChildrenProps } from '@/components/Form/FormControl';
import './TextField.css';

export interface TextFieldProps extends Partial<FormControlChildrenProps> {
  className?: string;
  style?: CSSProperties;
}

const TextField = forwardRef<HTMLInputElement | null, TextFieldProps>(({ className, style, label, ...props }, forwardedRef) => {
  return (
    <div className={clsx('text-field', className)} style={style}>
      {label && <Label.Root htmlFor={props.id}>
        {label}
      </Label.Root>}
      <input {...props} ref={forwardedRef} autoComplete='off' />
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField;
