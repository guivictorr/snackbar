import {
  Box,
  Button,
  HStack,
  IconButton,
  NativeBaseProvider,
  Text,
  VStack,
} from 'native-base'

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SlideInUp,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'

enum SnackbarVariantsEnum {
  SUCCESS = '#00ff00',
  ERROR = '#ff0000',
}

type SnackOptions = {
  title: string
  description: string
  variant?: keyof typeof SnackbarVariantsEnum
}

type SnackbarContextProps = {
  openSnackbar: (props: SnackOptions) => void
  closeSnackbar: () => void
}

export const SnackbarContext = createContext({} as SnackbarContextProps)
let timeout: NodeJS.Timeout

const wait = (delay: number = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(null), delay))

const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const [snackOptions, setSnackOptions] = useState<SnackOptions | null>(null)

  // const theme = useTheme()
  const closeSnackbar = () => {
    setSnackOptions(null)
    clearTimeout(timeout)
  }

  const closeSnackAfterSomeTime = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      closeSnackbar()
    }, 5000)
  }

  const openSnackbar = async (options: SnackOptions) => {
    setSnackOptions((prevState) => ({ ...prevState, ...options }))
    closeSnackAfterSomeTime()
  }

  useEffect(() => {
    if (snackOptions !== null) {
      closeSnackbar()
    }
  }, [snackOptions])

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      {!!snackOptions && (
        <Animated.View
          entering={SlideInDown.duration(500)}
          exiting={SlideOutDown.duration(500)}
          style={[
            {
              ...styles.bottomSheet,
              backgroundColor:
                snackOptions.variant === 'ERROR' ? '#ff0000' : '#00ff00',
            },
            // style,
          ]}
        >
          <HStack justifyContent="space-between">
            <VStack>
              <Text color="white" fontSize="2xl" mb="1">
                {snackOptions.title}
              </Text>
              <Text maxW="80" color="white">
                {snackOptions.description}
              </Text>
            </VStack>
            <IconButton
              onPress={closeSnackbar}
              borderRadius="full"
              alignSelf="flex-start"
              _icon={{
                as: Ionicons,
                name: 'close',
                color: 'white',
              }}
              _pressed={{
                background: 'white:alpha.20',
              }}
            />
          </HStack>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: '100%',
    paddingTop: 22,
    paddingBottom: 14,
    paddingHorizontal: 26,
    height: 150,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
})

function Home() {
  const { openSnackbar } = useContext(SnackbarContext)
  return (
    <Box flex="1" alignItems="center" justifyContent="center">
      <Button
        onPress={() =>
          openSnackbar({
            description: 'desc',
            title: 'title',
            variant: 'ERROR',
          })
        }
      >
        open snackbar
      </Button>
      <Button
        onPress={() =>
          openSnackbar({
            description: 'desc',
            title: 'title',
            variant: 'SUCCESS',
          })
        }
      >
        open snackbar
      </Button>
    </Box>
  )
}
export default function App() {
  return (
    <NativeBaseProvider>
      <SnackbarProvider>
        <Home />
      </SnackbarProvider>
    </NativeBaseProvider>
  )
}
