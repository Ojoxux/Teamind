'use client';

import {
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  type TagProps,
} from '@chakra-ui/react';
import { FiX } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export interface KeywordTagProps extends TagProps {
  keyword: string;
  icon?: IconType;
  onRemove?: () => void;
  isRemovable?: boolean;
}

export const KeywordTag = ({
  keyword,
  icon,
  onRemove,
  isRemovable = false,
  ...props
}: KeywordTagProps) => {
  return (
    <Tag
      size="md"
      borderRadius="full"
      variant="subtle"
      colorScheme="blue"
      cursor={props.onClick ? 'pointer' : 'default'}
      {...props}
    >
      {icon && <TagLeftIcon as={icon} />}
      <TagLabel>{keyword}</TagLabel>
      {isRemovable && onRemove && (
        <TagRightIcon
          as={FiX}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </Tag>
  );
};
