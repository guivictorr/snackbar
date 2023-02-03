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
  useState,
} from 'react'
import { StyleSheet } from 'react-native'
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons'

type SnackOptions = {
  title: string
  description: string
}

type SnackbarContextProps = {
  openSnackbar: (props: SnackOptions) => void
  closeSnackbar: () => void
}

export const SnackbarContext = createContext({} as SnackbarContextProps)

let timeout: NodeJS.Timeout

const SnackbarProvider = ({ children }: PropsWithChildren) => {
  const [snackOptions, setSnackOptions] = useState<SnackOptions | null>(null)

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
    if (snackOptions) {
      await closeSnackbar()
    }

    setSnackOptions((prevState) => ({ ...prevState, ...options }))
    closeSnackAfterSomeTime()
  }

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}
      {!!snackOptions && (
        <Animated.View
          entering={SlideInDown.duration(500)}
          exiting={SlideOutDown.duration(500)}
          style={styles.bottomSheet}
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
    backgroundColor: 'tomato',
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
            description: 'Snack 1',
            title: 'Snack 1',
          })
        }
      >
        open snackbar
      </Button>
      <Button
        onPress={() =>
          openSnackbar({
            description: 'Snack 2',
            title: 'Snack 2',
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
