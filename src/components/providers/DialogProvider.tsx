'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Swal, { SweetAlertIcon } from 'sweetalert2'; // SweetAlert2 임포트

// --- 1. 기본 타입 정의 ---
type SweetAlertBuiltInIcon = SweetAlertIcon;

// Alert 다이얼로그의 옵션 타입
interface AlertDialogOptions {
  type: 'alert';
  title: string;
  message: string;
  confirmText?: string;
  useSweetAlert?: boolean; // SweetAlert2 사용 여부 플래그 추가
  sweetAlertIcon?: SweetAlertBuiltInIcon | false;
}

// Confirm 다이얼로그의 옵션 타입
interface ConfirmDialogOptions {
  type: 'confirm';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  useSweetAlert?: boolean; // SweetAlert2 사용 여부 플래그 추가
  sweetAlertIcon?: SweetAlertBuiltInIcon | false;
}

// 모든 다이얼로그 옵션의 유니온 타입
type AllDialogOptions = AlertDialogOptions | ConfirmDialogOptions;

// --- 2. Context를 통해 노출될 API 타입 정의 (함수 오버로드 사용) ---
interface DialogContextType {
  showAlert(
    title: string,
    message: string,
    options?: Omit<AlertDialogOptions, 'type' | 'title' | 'message'>,
  ): Promise<true>;
  showConfirm(
    title: string,
    message: string,
    options?: Omit<ConfirmDialogOptions, 'type' | 'title' | 'message'>,
  ): Promise<boolean>;
}

// DialogProvider 컴포넌트의 Props 타입
interface DialogProviderProps {
  children: ReactNode;
}

// --- 3. Context 생성 ---
const DialogContext = createContext<DialogContextType | null>(null);

// --- 4. useDialog 훅 ---
export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      'DialogProvider 컴포넌트 내부에서 사용해야 합니다. 루트에 추가해주세요.',
    );
  }
  return context;
};

// --- 5. DialogProvider 컴포넌트 ---
export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<AllDialogOptions>({
    type: 'alert',
    title: '',
    message: '',
  });
  const [resolvePromise, setResolvePromise] = useState<
    ((value: any) => void) | null
  >(null);

  // 내부 showDialog 함수
  const showDialog = useCallback(
    <T extends AllDialogOptions>(
      config: T,
    ): Promise<
      T extends AlertDialogOptions ? true : boolean // Alert면 true, Confirm이면 boolean 반환
    > => {
      // SweetAlert2 사용 플래그가 true인 경우 SweetAlert2 호출
      if (config.useSweetAlert) {
        let iconToUse: SweetAlertIcon | undefined;
        if (config.sweetAlertIcon === false) {
          iconToUse = undefined; // false로 설정하면 아이콘 없음
        } else if (config.sweetAlertIcon) {
          iconToUse = config.sweetAlertIcon; // 명시적으로 지정된 아이콘 사용
        } else {
          // sweetAlertIcon이 지정되지 않았을 때 기본 아이콘 설정
          iconToUse = config.type === 'alert' ? 'info' : 'question';
        }

        if (config.type === 'alert') {
          return Swal.fire({
            title: config.title,
            text: config.message,
            icon: iconToUse,
            confirmButtonText: config.confirmText || '확인',
            allowOutsideClick: false, // 외부 클릭으로 닫히지 않도록
            customClass: {
              popup: 'swal2-popup-high-zindex',
            },
            // 기타 SweetAlert2 옵션 추가 가능
          }).then(() => true) as Promise<true>; // SweetAlert2는 Promise<SweetAlertResult>를 반환하므로 true로 매핑
        } else if (config.type === 'confirm') {
          return Swal.fire({
            title: config.title,
            text: config.message,
            icon: iconToUse,
            showCancelButton: true,
            confirmButtonText: config.confirmText || '확인',
            cancelButtonText: config.cancelText || '취소',
            reverseButtons: true, // 버튼 순서 뒤집기 (확인-취소 -> 취소-확인)
            allowOutsideClick: false,
            customClass: {
              popup: 'swal2-popup-high-zindex',
            },
          }).then((result) => {
            return result.isConfirmed; // '확인' 버튼 클릭 시 true, '취소' 클릭 시 false
          }) as Promise<T extends AlertDialogOptions ? true : boolean>;
        }
      }

      return new Promise((resolve) => {
        setOpen(true);
        setOptions(config);
        setResolvePromise(() => resolve);
      }) as Promise<T extends AlertDialogOptions ? true : boolean>;
    },
    [],
  );

  const handleClose = useCallback(
    (result: any) => {
      setOpen(false);
      if (resolvePromise) {
        resolvePromise(result);
        setResolvePromise(null);
      }
    },
    [resolvePromise],
  );

  // Alert 호출 함수
  const showAlert = useCallback(
    (
      title: string,
      message: string,
      alertOptions?: Omit<AlertDialogOptions, 'type' | 'title' | 'message'>,
    ): Promise<true> => {
      return showDialog({ type: 'alert', title, message, ...alertOptions });
    },
    [showDialog],
  );

  // Confirm 호출 함수
  const showConfirm = useCallback(
    (
      title: string,
      message: string,
      confirmOptions?: Omit<ConfirmDialogOptions, 'type' | 'title' | 'message'>,
    ): Promise<boolean> => {
      return showDialog({ type: 'confirm', title, message, ...confirmOptions });
    },
    [showDialog],
  );

  // 다이얼로그 내용 렌더링 함수 (Material-UI 전용)
  // `options.useSweetAlert`가 false일 때.
  const renderDialogContent = useCallback(() => {
    if (options.type === 'alert') {
      const alertOptions = options as AlertDialogOptions;
      return (
        <>
          <DialogTitle
            sx={{
              textAlign: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid #eee',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            {alertOptions.title}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '24px',
              minWidth: '300px',
            }}
          >
            <Typography sx={{ lineHeight: 1.6 }}>
              {alertOptions.message}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              padding: '16px 24px',
              borderTop: '1px solid #eee',
            }}
          >
            <Button
              onClick={() => handleClose(true)}
              autoFocus
              variant="contained"
              sx={{
                minWidth: '100px',
                fontWeight: 'bold',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              {alertOptions.confirmText || '확인'}
            </Button>
          </DialogActions>
        </>
      );
    } else if (options.type === 'confirm') {
      const confirmOptions = options as ConfirmDialogOptions;
      return (
        <>
          <DialogTitle
            sx={{
              textAlign: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid #eee',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            {confirmOptions.title}
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '24px',
              minWidth: '300px',
            }}
          >
            <Typography sx={{ lineHeight: 1.6 }}>
              {confirmOptions.message}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              gap: '12px',
              padding: '16px 24px',
              borderTop: '1px solid #eee',
            }}
          >
            <Button
              onClick={() => handleClose(false)}
              variant="outlined"
              sx={{
                minWidth: '100px',
                fontWeight: 'bold',
              }}
            >
              {confirmOptions.cancelText || '취소'}
            </Button>
            <Button
              onClick={() => handleClose(true)}
              autoFocus
              variant="contained"
              sx={{
                minWidth: '100px',
                fontWeight: 'bold',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              }}
            >
              {confirmOptions.confirmText || '확인'}
            </Button>
          </DialogActions>
        </>
      );
    }
    return null;
  }, [options, handleClose]);

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {/* SweetAlert2를 사용할 때는 Material-UI Dialog를 렌더링하지 않음 */}
      {!options.useSweetAlert && ( // useSweetAlert가 false일 때만 MUI Dialog 렌더링
        <Dialog
          open={open}
          onClose={() =>
            options.type === 'alert' ? handleClose(true) : handleClose(false)
          }
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
          slotProps={{
            paper: {
              sx: {
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
            },
          }}
        >
          {renderDialogContent()}
        </Dialog>
      )}
    </DialogContext.Provider>
  );
};
