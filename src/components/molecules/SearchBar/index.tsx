'use client';

import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  type InputGroupProps,
} from '@chakra-ui/react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { Input } from '@/components/atoms/Input';

export interface SearchBarProps extends Omit<InputGroupProps, 'onChange'> {
  onSearch?: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  onChange?: (value: string) => void;
}

export const SearchBar = ({
  onSearch,
  placeholder = '検索...',
  initialValue = '',
  onChange,
  ...props
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery('');     // 検索欄をクリア
    onSearch?.('');   // 空のクリエで検索 (元の表示に戻す)
    onChange?.('');   // 変更を通知
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange?.(newValue);
    
    // 入力が空になった時に元の表示に戻す
    if (newValue === '') {
      onSearch?.('');
    }
  };

  return (
    <InputGroup {...props}>
      <InputLeftElement pointerEvents="none">
        <FiSearch />
      </InputLeftElement>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        pl="12"
        pr="2.5rem"
      />
      {query && (
        <InputRightElement>
          <IconButton
            aria-label="検索をクリア"
            icon={<FiX />}
            size="sm"
            variant="ghost"
            onClick={handleClear}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
