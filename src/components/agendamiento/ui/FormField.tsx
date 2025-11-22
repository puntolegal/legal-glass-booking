// RUTA: src/components/agendamiento/ui/FormField.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  isValid?: boolean;
  errorMessage?: string;
  icon?: LucideIcon;
  rows?: number;
  maxLength?: number;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  tooltip?: string;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  isValid,
  errorMessage,
  icon: Icon,
  rows,
  maxLength,
  onPaste,
  tooltip,
  id,
}) => {
  const inputId = id || `field-${name}`;
  const errorId = `${inputId}-error`;
  const hasError = value && isValid === false;
  const hasSuccess = value && isValid === true;
  
  const inputClasses = `w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-900 dark:text-gray-100 text-base ${
    hasSuccess
      ? 'border-green-500 focus:border-green-500'
      : hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
  }`;
  
  return (
    <div>
      <label 
        htmlFor={inputId}
        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
      >
        {label}
        {required && <span className="text-red-500" aria-label="requerido">*</span>}
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg py-2 px-3 shadow-xl w-64">
                <p>{tooltip}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
              </div>
            </div>
          </div>
        )}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        {rows ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            rows={rows}
            maxLength={maxLength}
            className={`${inputClasses} resize-none`}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          />
        ) : (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onPaste={onPaste}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={`${inputClasses} ${Icon ? 'pl-12' : ''}`}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
          />
        )}
        
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {hasError && errorMessage && (
        <motion.p
          id={errorId}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
          role="alert"
        >
          {errorMessage}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;

