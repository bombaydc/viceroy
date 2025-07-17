'use client';
import { cn } from "@/utils/cn";
import { ChangeEvent, useState } from "react";
import './index.scss'

export interface InputTypes extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    type?: string;
    label?: string;
    placeholder?: string;
    inputClassName?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    helper?: string;
    pattern?: string;
    error?: string
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}


export const InputField = ({
    type = 'text',
    className = '',
    inputClassName = '',
    id ,
    label = '',
    placeholder = '',
    value = '',
    pattern,
    required = false,
    disabled = false,
    maxLength = 255,
    onBlur = () => { },
    onChange = () => { },
    readOnly = false,
    helper = '',
    error = '',
}: Readonly<InputTypes>) => {
    return (
        <div className={cn("core-input-field", className)}>
            {label  && id? (
                <label htmlFor={id} className="core-input-field__label">
                    {label}
                    {required ? '*' : ''}
                </label>
            ) : null}
            <input
                type={type}
                id={id}
                defaultValue={value ?? ''}
                name={id}
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                readOnly={readOnly}
                pattern={pattern}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={cn("core-input-field__input", inputClassName)}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {helper && <p className="core-input-field__helper">{helper}</p>}
            {error && (
                <p id={`${id}-error`} className="core-input-field__error">
                    {error}
                </p>
            )}
        </div>
    );
}

const sanitizeEmail = (value: string): string => {
  return value
    .replace(/\s+/g, '') // remove **all** spaces inside
    .replace(/[<>{}()[\]"'`;/\\]+/g, '') // strip dangerous chars
    .trim();
};

const isValidEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

export const EmailField = (props: InputTypes) => {
  const [value, setValue] = useState(() => props.value ?? '');
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeEmail(rawValue);
    const valid = isValidEmail(sanitizedValue);

    if (error && valid) {
      setError('');
    }

    setValue(sanitizedValue);

    props.onChange?.({
      ...e,
      target: {
        ...e.target,
        value: sanitizedValue,
      },
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeEmail(rawValue);
    const valid = isValidEmail(sanitizedValue);

    setError(!valid && sanitizedValue ? 'Invalid email format' : '');
    props.onBlur?.(e);
  };

  return (
    <InputField
      type="email"
      {...props}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      error={error}
    />
  );
};
