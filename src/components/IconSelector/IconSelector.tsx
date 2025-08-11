'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Material-UI 아이콘들
import {
  Dashboard,
  Settings,
  People,
  Email,
  CloudUpload,
  AdminPanelSettings,
  Home,
  Menu,
  Folder,
  Description,
  List,
  ViewList,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Security,
  AccountCircle,
  Notifications,
  Help,
  Info,
  Warning,
  Error,
  CheckCircle,
  Cancel,
  Save,
  Close,
  Refresh,
  Download,
  Upload,
  Print,
  Share,
  Favorite,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Schedule,
  CalendarToday,
  AccessTime,
  LocationOn,
  Phone,
  Language,
  Translate,
  Code,
  Build,
  Extension,
  Apps,
  Widgets,
  ViewModule,
  ViewComfy,
  ViewCompact,
  ViewHeadline,
  ViewStream,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  ViewCarousel,
  ViewQuilt,
  ViewColumn,
  ViewArray,

  // 메뉴관리 관련 아이콘들 추가
  MenuBook,
  MenuOpen,
  RestaurantMenu,
  ListAlt,
  FormatListBulleted,
  FormatListNumbered,
  DragIndicator,
  Reorder,
  SortByAlpha,

  // 비즈니스 관련 아이콘들 추가
  Business,
  BusinessCenter,
  CorporateFare,
  Domain,
  Store,
  Storefront,
  ShoppingCart,
  ShoppingBasket,
  Payment,
  CreditCard,
  AccountBalance,
  AccountBalanceWallet,
  MonetizationOn,
  AttachMoney,
  Euro,
  CurrencyExchange,
  TrendingUp,
  TrendingDown,
  ShowChart,
  BarChart,
  PieChart,
  Assessment,
  Analytics,
  Timeline,
  Event,
  CalendarMonth,
  Assignment,
  Task,
  Checklist,
  Work,
  WorkOutline,
  MeetingRoom,
  Group,
  SupervisorAccount,
  PersonAdd,
  PersonRemove,
  PeopleAlt,
  Handshake,
  Support,
  Headset,
  Chat,
  Directions,
  LocalShipping,
  LocalOffer,
  Discount,
  Loyalty,
  Verified,
  Shield,
  Report,
  BugReport,
  QuestionAnswer,
  Feedback,
  RateReview,
  Link,
  ContentCopy,
  Backup,
  Restore,
  Archive,
  Create,
  Tune,
  FilterList,
  Sort,
} from '@mui/icons-material';

// 아이콘 목록
const ICONS = [
  { name: 'Dashboard', icon: Dashboard },
  { name: 'Settings', icon: Settings },
  { name: 'People', icon: People },
  { name: 'Email', icon: Email },
  { name: 'CloudUpload', icon: CloudUpload },
  { name: 'AdminPanelSettings', icon: AdminPanelSettings },
  { name: 'Home', icon: Home },
  { name: 'Menu', icon: Menu },
  { name: 'Folder', icon: Folder },
  { name: 'Description', icon: Description },
  { name: 'List', icon: List },
  { name: 'ViewList', icon: ViewList },
  { name: 'Add', icon: Add },
  { name: 'Edit', icon: Edit },
  { name: 'Delete', icon: Delete },
  { name: 'Visibility', icon: Visibility },
  { name: 'VisibilityOff', icon: VisibilityOff },
  { name: 'Lock', icon: Lock },
  { name: 'LockOpen', icon: LockOpen },
  { name: 'Security', icon: Security },
  { name: 'AccountCircle', icon: AccountCircle },
  { name: 'Notifications', icon: Notifications },
  { name: 'Help', icon: Help },
  { name: 'Info', icon: Info },
  { name: 'Warning', icon: Warning },
  { name: 'Error', icon: Error },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Cancel', icon: Cancel },
  { name: 'Save', icon: Save },
  { name: 'Close', icon: Close },
  { name: 'Refresh', icon: Refresh },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'Print', icon: Print },
  { name: 'Share', icon: Share },
  { name: 'Favorite', icon: Favorite },
  { name: 'Star', icon: Star },
  { name: 'StarBorder', icon: StarBorder },
  { name: 'ThumbUp', icon: ThumbUp },
  { name: 'ThumbDown', icon: ThumbDown },
  { name: 'FavoriteBorder', icon: FavoriteBorder },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'BookmarkBorder', icon: BookmarkBorder },
  { name: 'Schedule', icon: Schedule },
  { name: 'CalendarToday', icon: CalendarToday },
  { name: 'AccessTime', icon: AccessTime },
  { name: 'LocationOn', icon: LocationOn },
  { name: 'Phone', icon: Phone },
  { name: 'Language', icon: Language },
  { name: 'Translate', icon: Translate },
  { name: 'Code', icon: Code },
  { name: 'Build', icon: Build },
  { name: 'Extension', icon: Extension },
  { name: 'Apps', icon: Apps },
  { name: 'Widgets', icon: Widgets },
  { name: 'ViewModule', icon: ViewModule },
  { name: 'ViewComfy', icon: ViewComfy },
  { name: 'ViewCompact', icon: ViewCompact },
  { name: 'ViewHeadline', icon: ViewHeadline },
  { name: 'ViewStream', icon: ViewStream },
  { name: 'ViewWeek', icon: ViewWeek },
  { name: 'ViewDay', icon: ViewDay },
  { name: 'ViewAgenda', icon: ViewAgenda },
  { name: 'ViewCarousel', icon: ViewCarousel },
  { name: 'ViewQuilt', icon: ViewQuilt },
  { name: 'ViewColumn', icon: ViewColumn },
  { name: 'ViewArray', icon: ViewArray },

  // 메뉴관리 관련 아이콘들 추가
  { name: 'MenuBook', icon: MenuBook },
  { name: 'MenuOpen', icon: MenuOpen },
  { name: 'RestaurantMenu', icon: RestaurantMenu },
  { name: 'ListAlt', icon: ListAlt },
  { name: 'FormatListBulleted', icon: FormatListBulleted },
  { name: 'FormatListNumbered', icon: FormatListNumbered },
  { name: 'DragIndicator', icon: DragIndicator },
  { name: 'Reorder', icon: Reorder },
  { name: 'SortByAlpha', icon: SortByAlpha },

  // 비즈니스 관련 아이콘들 추가
  { name: 'Business', icon: Business },
  { name: 'BusinessCenter', icon: BusinessCenter },
  { name: 'CorporateFare', icon: CorporateFare },
  { name: 'Domain', icon: Domain },
  { name: 'Store', icon: Store },
  { name: 'Storefront', icon: Storefront },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'ShoppingBasket', icon: ShoppingBasket },
  { name: 'Payment', icon: Payment },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'AccountBalance', icon: AccountBalance },
  { name: 'AccountBalanceWallet', icon: AccountBalanceWallet },
  { name: 'MonetizationOn', icon: MonetizationOn },
  { name: 'AttachMoney', icon: AttachMoney },
  { name: 'Euro', icon: Euro },
  { name: 'CurrencyExchange', icon: CurrencyExchange },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'TrendingDown', icon: TrendingDown },
  { name: 'ShowChart', icon: ShowChart },
  { name: 'BarChart', icon: BarChart },
  { name: 'PieChart', icon: PieChart },
  { name: 'Assessment', icon: Assessment },
  { name: 'Analytics', icon: Analytics },
  { name: 'Timeline', icon: Timeline },
  { name: 'Event', icon: Event },
  { name: 'CalendarMonth', icon: CalendarMonth },
  { name: 'Assignment', icon: Assignment },
  { name: 'Task', icon: Task },
  { name: 'Checklist', icon: Checklist },
  { name: 'Work', icon: Work },
  { name: 'WorkOutline', icon: WorkOutline },
  { name: 'MeetingRoom', icon: MeetingRoom },
  { name: 'Group', icon: Group },
  { name: 'SupervisorAccount', icon: SupervisorAccount },
  { name: 'PersonAdd', icon: PersonAdd },
  { name: 'PersonRemove', icon: PersonRemove },
  { name: 'PeopleAlt', icon: PeopleAlt },
  { name: 'Handshake', icon: Handshake },
  { name: 'Support', icon: Support },
  { name: 'Headset', icon: Headset },
  { name: 'Chat', icon: Chat },
  { name: 'Directions', icon: Directions },
  { name: 'LocalShipping', icon: LocalShipping },
  { name: 'LocalOffer', icon: LocalOffer },
  { name: 'Discount', icon: Discount },
  { name: 'Loyalty', icon: Loyalty },
  { name: 'Verified', icon: Verified },
  { name: 'Shield', icon: Shield },
  { name: 'Report', icon: Report },
  { name: 'BugReport', icon: BugReport },
  { name: 'QuestionAnswer', icon: QuestionAnswer },
  { name: 'Feedback', icon: Feedback },
  { name: 'RateReview', icon: RateReview },
  { name: 'Link', icon: Link },
  { name: 'ContentCopy', icon: ContentCopy },
  { name: 'Backup', icon: Backup },
  { name: 'Restore', icon: Restore },
  { name: 'Archive', icon: Archive },
  { name: 'Create', icon: Create },
  { name: 'Tune', icon: Tune },
  { name: 'FilterList', icon: FilterList },
  { name: 'Sort', icon: Sort },
];

interface IconSelectorProps {
  value: string | undefined;
  onChange: (iconName: string) => void;
  label?: string;
  readOnly?: boolean;
}

export default function IconSelector({
  value,
  onChange,
  label = '아이콘',
  readOnly = false,
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearchTerm('');
  };

  const filteredIcons = ICONS.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedIcon = ICONS.find((icon) => icon.name === value);
  const IconComponent = selectedIcon?.icon;

  return (
    <>
      <TextField
        label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        placeholder="아이콘을 선택하세요"
        disabled={readOnly}
        InputProps={{
          readOnly: true, // 읽기 전용으로 설정
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setOpen(true)}>
                {IconComponent ? <IconComponent /> : <SearchIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onClick={() => setOpen(true)} // 클릭 시 다이얼로그 열기
        sx={{ cursor: 'pointer' }} // 클릭 가능함을 표시
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>아이콘 선택</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="아이콘 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />

          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: 1,
              }}
            >
              {filteredIcons.map(({ name, icon: IconComponent }) => (
                <Box key={name}>
                  <Chip
                    icon={<IconComponent />}
                    label={name}
                    onClick={() => handleIconSelect(name)}
                    variant={value === name ? 'filled' : 'outlined'}
                    color={value === name ? 'primary' : 'default'}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
