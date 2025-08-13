import React from 'react';
import * as MuiIcons from '@mui/icons-material';

/**
 * 아이콘 이름을 Material-UI 아이콘 컴포넌트로 변환
 * @param iconName 아이콘 이름 (예: 'Dashboard', 'Person')
 * @returns Material-UI 아이콘 컴포넌트 또는 기본 아이콘
 */
export function getIconComponent(iconName: string) {
  if (!iconName) return <MuiIcons.Info />;

  // Material-UI 아이콘에서 해당 이름 찾기
  const IconComponent = (MuiIcons as any)[iconName];

  if (IconComponent) {
    return <IconComponent />;
  }

  // 기본 아이콘 반환
  return <MuiIcons.Info />;
}

/**
 * 정적 메뉴용 아이콘 매핑
 */
export const STATIC_ICONS: Record<string, React.ReactElement> = {
  Dashboard: <MuiIcons.Dashboard />,
  CloudUpload: <MuiIcons.CloudUpload />,
  Email: <MuiIcons.Email />,
  AdminPanelSettings: <MuiIcons.AdminPanelSettings />,
  Person: <MuiIcons.Person />,
  Security: <MuiIcons.Security />,
  ListAlt: <MuiIcons.ListAlt />,
};
