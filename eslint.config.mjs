import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// prettier 관련 모듈들을 import 합니다.
// eslint-plugin-prettier는 직접 import할 필요 없이 eslint-config-prettier가 처리할 수 있습니다.
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: true,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // eslint-plugin-prettier를 플러그인으로 등록.
    plugins: {
      prettier: prettier,
    },
    rules: {
      // prettier/prettier 규칙을 'error'로 설정하여 포맷팅 위반 시 ESLint 오류로 전달.
      'prettier/prettier': 'error',
      // any 허용
      '@typescript-eslint/no-explicit-any': 'off',
      // never read 허용
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // prettierConfig 가장 마지막 위치 ESLint 규칙을 비활성화하여 Prettier와 충돌방지.
  prettierConfig,
];

export default eslintConfig;
