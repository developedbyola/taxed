import {
  HStack,
  Input,
  Text,
  Icon,
  Textarea as ChakraTextarea,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import {
  useController,
  type UseControllerReturn,
  type UseControllerProps,
} from 'react-hook-form';
import { Lock, LockOpen } from 'lucide-react';

type Context = {
  id: string;
  isTextHidden: boolean;
  onHiddenText: () => void;
} & UseControllerReturn;

const fieldContext = React.createContext<Context | null>(null);

export const useField = (
  value: UseControllerProps & { textHidden?: boolean }
): Context => {
  const { control, name, textHidden = false } = value;
  const [isTextHidden, setIsTextHidden] = React.useState(textHidden);

  const id = React.useId();
  const controller = useController({ name, control });

  return {
    id,
    isTextHidden,
    onHiddenText: () => setIsTextHidden((prev) => !prev),
    ...controller,
  };
};

export const useFieldContext = () => {
  const context = React.useContext(fieldContext);
  if (!context) {
    throw new Error('useFieldContext must be used within a FieldProvider');
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof Flex>;
type ProviderProps = React.ComponentProps<typeof Flex> &
  React.ComponentProps<typeof fieldContext.Provider>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, flexDirection = 'column', ...restProps } = props;

  return (
    <fieldContext.Provider value={value}>
      <Flex
        ref={ref}
        flexDirection={flexDirection}
        {...restProps}
      />
    </fieldContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Flex>;
type RootProps = React.ComponentProps<typeof Flex> &
  UseControllerProps & { textHidden?: boolean };
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const {
    name,
    control,
    flexDirection = 'column',
    gap = 1,
    textHidden = false,
    ...restProps
  } = props;
  const context = useField({ name, control, textHidden });

  return (
    <Provider value={context}>
      <Flex
        ref={ref}
        gap={gap}
        flexDirection={flexDirection}
        {...restProps}
      />
    </Provider>
  );
});

type LabelRef = React.ComponentRef<typeof Text>;
type LabelProps = React.ComponentProps<typeof Text>;
const Label = React.forwardRef<LabelRef, LabelProps>((props, ref) => {
  const {
    fontSize = '0.875rem',
    color = 'gray.500',
    letterSpacing = '-1%',
    fontWeight = 'normal',
    ...restProps
  } = props;
  useFieldContext();

  return (
    <Text
      as='label'
      ref={ref}
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}
      letterSpacing={letterSpacing}
      {...restProps}
    />
  );
});

type ContentRef = React.ComponentRef<typeof HStack>;
type ContentProps = React.ComponentProps<typeof HStack>;
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const {
    gap = 1,
    rounded = 12,
    height = '44px',
    overflow = 'hidden',
    bg = 'gray.100',
    ...restProps
  } = props;
  useFieldContext();

  return (
    <HStack
      ref={ref}
      bg={bg}
      gap={gap}
      height={height}
      rounded={rounded}
      overflow={overflow}
      {...restProps}
    />
  );
});

type TextFieldRef = React.ComponentRef<typeof Input>;
type TextFieldProps = React.ComponentProps<typeof Input>;
const TextField = React.forwardRef<TextFieldRef, TextFieldProps>(
  (props, ref) => {
    const { field, id, isTextHidden } = useFieldContext();

    const {
      px = 3,
      flex = 1,
      bg = 'inherit',
      border = 'none',
      outline = 'none',
      fontSize = '1rem',
      autoCapitalize = 'none',
      autoCorrect = 'on',
      type,
      letterSpacing = '-0.005em',
      ...restProps
    } = props;

    return (
      <Input
        px={px}
        id={id}
        bg={bg}
        ref={ref}
        flex={flex}
        border={border}
        name={field.name}
        outline={outline}
        fontSize={fontSize}
        value={field.value || ''}
        type={isTextHidden ? 'password' : type || 'text'}
        _placeholder={{
          color: 'gray.500',
        }}
        onBlur={field.onBlur}
        onChange={field.onChange}
        letterSpacing={letterSpacing}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        {...restProps}
      />
    );
  }
);

type FeedbackRef = React.ComponentRef<typeof Text>;
type FeedbackProps = React.ComponentProps<typeof Text>;
const Feedback = React.forwardRef<FeedbackRef, FeedbackProps>((props, ref) => {
  const {
    fontSize = '0.875rem',
    lineHeight = '1.25rem',
    color = 'red.500',
    letterSpacing = '-1%',
    ...restProps
  } = props;
  const { fieldState } = useFieldContext();

  const error = fieldState.error?.message;

  if (!error) {
    return null;
  }

  return (
    <Text
      ref={ref}
      fontSize={fontSize}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      {...restProps}
      color={color}
    >
      {error}
    </Text>
  );
});

type HintRef = React.ComponentRef<typeof Text>;
type HintProps = React.ComponentProps<typeof Text>;
const Hint = React.forwardRef<HintRef, HintProps>((props, ref) => {
  const {
    fontSize = '0.875rem',
    lineHeight = '1.25rem',
    color = 'gray.500',
    letterSpacing = '-1%',
    ...restProps
  } = props;
  useFieldContext();

  return (
    <Text
      ref={ref}
      color={color}
      fontSize={fontSize}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      {...restProps}
    />
  );
});

type HiddenRef = React.ComponentRef<typeof Icon>;
type HiddenProps = React.ComponentProps<typeof Icon>;
const Hidden = React.forwardRef<HiddenRef, HiddenProps>((props, ref) => {
  const {
    size = 'md',
    mx = 3,
    color = 'gray.400',
    cursor = 'pointer',
    ...restProps
  } = props;
  const { isTextHidden, onHiddenText } = useFieldContext();

  return (
    <Icon
      mx={mx}
      asChild
      ref={ref}
      size={size}
      color={color}
      cursor={cursor}
      {...restProps}
      transition={'all 0.2s ease-in-out'}
      _hover={{
        color: 'gray.900',
      }}
      onClick={onHiddenText}
    >
      {isTextHidden ? <LockOpen /> : <Lock />}
    </Icon>
  );
});

type TextareaRef = React.ComponentRef<typeof ChakraTextarea>;
type TextareaProps = Omit<
  React.ComponentProps<typeof ChakraTextarea>,
  'onChange' | 'onBlur' | 'value' | 'name'
>;
const Textarea = React.forwardRef<TextareaRef, TextareaProps>((props, ref) => {
  const { field } = useFieldContext();

  const {
    px = 3,
    py = 2,
    flex = 1,
    bg = 'inherit',
    border = 'none',
    outline = 'none',
    fontSize = '1rem',
    resize = 'vertical',
    minH = '100px',
    ...restProps
  } = props;

  return (
    <ChakraTextarea
      px={px}
      py={py}
      flex={flex}
      bg={bg}
      ref={ref}
      border={border}
      outline={outline}
      fontSize={fontSize}
      resize={resize}
      minH={minH}
      name={field.name}
      value={field.value || ''}
      _placeholder={{
        color: 'gray.500',
      }}
      onBlur={field.onBlur}
      onChange={field.onChange}
      {...restProps}
    />
  );
});

export const Field = {
  Root,
  Label,
  Content,
  TextField,
  Textarea,
  Hidden,
  Feedback,
  Hint,
};
