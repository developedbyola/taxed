import gsap from 'gsap';
import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import { CircleCheck, CircleX } from 'lucide-react';

type DialogConfig = {
  id?: string;
  title?: string;
  message?: string;
  isOpen?: boolean;
  variant?: 'success' | 'destructive';
  closeOnOverlayClick?: boolean;
  actions: {
    label: string;
    onClick?: () => void;
    variant?: 'solid' | 'outline' | 'ghost';
  }[];
};

type DialogContextType = {
  dialogs: DialogConfig[];
  open: (config: Omit<DialogConfig, 'isOpen'>) => void;
  close: (id: string) => void;
};

const DialogContext = React.createContext<DialogContextType | null>(null);

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogs, setDialogs] = React.useState<DialogConfig[]>([]);

  const open = (config: Omit<DialogConfig, 'isOpen'>) => {
    const id = config.id || Math.random().toString(36).substring(2, 9);
    setDialogs((prev) => [...prev, { ...config, id, isOpen: true }]);
  };

  const close = (id: string) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  };

  return (
    <DialogContext.Provider value={{ dialogs, open, close }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return {
    open: context.open,
    close: context.close,
  };
};

// Dialog component that renders all active dialogs
export const DialogRenderer = () => {
  const { dialogs, close } = React.useContext(DialogContext)!;

  return (
    <>
      {dialogs.map((dialog) => (
        <DialogComponent
          key={dialog.id}
          {...dialog}
          onClose={() => {
            close(dialog.id!);
          }}
        />
      ))}
    </>
  );
};

// Basic DialogComponent implementation
const DialogComponent = ({
  title,
  message,
  onClose,
  actions,
  variant = 'destructive',
  closeOnOverlayClick = false,
}: DialogConfig & { onClose: () => void }) => {
  const backdropId = React.useId();
  const contentId = React.useId();

  useGSAP(
    () => {
      gsap.fromTo(
        `#dialog_overlay${backdropId}`,
        {
          opacity: 0,
          immediateRender: false,
        },
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        `#dialog_content${contentId}`,
        {
          y: 20,
          opacity: 0,
          immediateRender: false,
        },
        {
          y: 0,
          delay: 0.1,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }
      );
    },
    { dependencies: [onClose] }
  );

  const Symbols = {
    destructive: {
      icon: CircleX,
      color: 'white',
      backgroundColor: 'red.500',
    },
    success: {
      icon: CircleCheck,
      color: 'white',
      backgroundColor: 'green.500',
    },
  };

  const Symbol = Symbols[variant];

  return createPortal(
    <React.Fragment>
      <Box
        top={0}
        left={0}
        width='100%'
        height='100%'
        zIndex={98}
        position='fixed'
        bg='rgba(0, 0, 0, 0.5)'
        backdropFilter='blur(8px)'
        id={`dialog_overlay${backdropId}`}
      />
      <Flex
        top={0}
        left={0}
        width='100%'
        height='100%'
        zIndex={99}
        shadow={'xs'}
        position='absolute'
        alignItems='center'
        flexDirection='column'
        onClick={(e) => {
          e.stopPropagation();
          closeOnOverlayClick && onClose();
        }}
        justifyContent='center'
      >
        <Container
          p={3}
          rounded={20}
          maxWidth={'24rem'}
          backdropFilter='blur(8px)'
          id={`dialog_content${contentId}`}
          bg='rgba(255, 255, 255, 0.8)'
        >
          <Flex flexDirection={'row'}>
            <Icon
              p={1.5}
              width={12}
              height={12}
              mx={'auto'}
              rounded={16}
              color={Symbol.color}
              bg={Symbol.backgroundColor}
            >
              <Symbol.icon size={20} />
            </Icon>
          </Flex>
          <Heading
            mt={3}
            mx={'auto'}
            fontSize={20}
            maxW={'16rem'}
            color={'gray.900'}
            textAlign={'center'}
            lineHeight={'short'}
            letterSpacing={'-1%'}
            fontWeight={'semibold'}
          >
            {title}
          </Heading>
          <Text
            mt={1}
            mx={'auto'}
            fontSize={14}
            maxW={'21rem'}
            color={'gray.500'}
            textAlign={'center'}
          >
            {message}
          </Text>
          <HStack
            mt={6}
            justifyContent={'center'}
          >
            {actions.map((action) => (
              <Button
                flex={1}
                rounded={12}
                key={action.label}
                fontWeight={'semibold'}
                variant={action.variant || 'ghost'}
                onClick={() => {
                  action?.onClick?.();
                  onClose();
                }}
              >
                {action.label}
              </Button>
            ))}
          </HStack>
        </Container>
      </Flex>
    </React.Fragment>,
    document.body
  );
};
