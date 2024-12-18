import {
  ActionIcon,
  Box,
  Card,
  Center,
  Group,
  type MantineColor,
  Tooltip,
} from '@mantine/core'
import { TimeInput, type TimeInputProps } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconStopwatch,
  IconX,
} from '@tabler/icons-react'
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import CountdownWorker from './countdown.worker?worker'

export function TimerButton() {
  const { isVisible, action } = useTimerVisibility()

  if (isVisible) {
    return <TimeIndicator close={action.close} />
  }

  return (
    <Group>
      <Tooltip label='タイマー'>
        <ActionIcon size='lg' variant='default' onClick={action.open}>
          <IconStopwatch />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

function useTimerVisibility() {
  const [isVisible, action] = useDisclosure(false)

  return {
    isVisible,
    action,
  }
}

type TimeIndicatorProps = {
  close: () => void
}

type TimerControlState = 'toStart' | 'toPause' | 'toStop'

function TimeIndicator({ close }: TimeIndicatorProps) {
  const { state, action } = useTimer()

  const handleInputChanged = useCallback<
    Exclude<TimeInputProps['onChange'], undefined>
  >(
    (e) => {
      action.updateInitialSeconds(e.target.value)
    },
    [action],
  )

  const timerControllerStyle = useMemo<
    Record<
      TimerControlState,
      { label: string; color: MantineColor; icon: ReactNode }
    >
  >(
    () => ({
      toStart: {
        label: '開始',
        color: 'teal',
        icon: <IconPlayerPlayFilled />,
      },
      toPause: {
        label: '一時停止',
        color: 'orange',
        icon: <IconPlayerPauseFilled />,
      },
      toStop: {
        label: '停止',
        color: 'red',
        icon: <IconPlayerStopFilled />,
      },
    }),
    [],
  )

  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    if (state.controller === 'toStop') {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [state])

  return (
    <>
      <Card h='34px' w='auto' px='4px' py='0' withBorder>
        <Center h='100%'>
          <Group gap='0' justify='center'>
            <Box mr='4px'>
              <IconStopwatch />
            </Box>
            <TimeInput
              variant='unstyled'
              size='xl'
              onChange={handleInputChanged}
              value={state.time}
              withSeconds
            />
            <Tooltip label={timerControllerStyle[state.controller].label}>
              <ActionIcon
                size='md'
                variant='subtle'
                color={timerControllerStyle[state.controller].color}
                onClick={action.controlTimer}
              >
                {timerControllerStyle[state.controller].icon}
              </ActionIcon>
            </Tooltip>
            <Tooltip label='タイマーを閉じる'>
              <ActionIcon
                color='gray'
                size='md'
                variant='subtle'
                onClick={close}
              >
                <IconX onClick={close} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Center>
      </Card>
      <audio src='/static/timer-alarm.mp3' ref={audioRef} loop>
        <track kind='captions' />
      </audio>
    </>
  )
}

function useTimer() {
  const [initialSeconds, setInitialSeconds] = useState(0)
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const [controlState, setControlState] = useState<TimerControlState>('toStart')
  const [isCountdownActive, setIsCountdownActive] = useState(false)

  const updateInitialSeconds = useCallback(
    (input: string) => {
      if (controlState !== 'toStart') return

      const s = toSeconds(input)
      if (s !== null) {
        setDisplaySeconds(s)
        setInitialSeconds(s)
      }
    },
    [controlState],
  )

  const countdownRef = useRef<Worker | null>(null)

  useEffect(() => {
    countdownRef.current = new CountdownWorker()

    countdownRef.current.onmessage = () => {
      setDisplaySeconds((s) => s - 1)
    }

    return () => {
      countdownRef.current?.terminate()
    }
  }, [])

  const startCountdown = useCallback(() => {
    countdownRef.current?.postMessage('start')
    setIsCountdownActive(true)
  }, [])
  const stopCountdown = useCallback(() => {
    countdownRef.current?.postMessage('stop')
    setIsCountdownActive(false)
  }, [])

  const onTimerStarted = useCallback(() => {
    startCountdown()
    setControlState('toPause')
  }, [startCountdown])
  const onTimerPaused = useCallback(() => {
    stopCountdown()
    setControlState('toStart')
  }, [stopCountdown])
  const onTimerStopped = useCallback(() => {
    setDisplaySeconds(initialSeconds)
    setControlState('toStart')
  }, [initialSeconds])

  const controlTimer = useMemo(() => {
    switch (controlState) {
      case 'toStart':
        return onTimerStarted
      case 'toPause':
        return onTimerPaused
      case 'toStop':
        return onTimerStopped

      default: {
        const _: never = controlState
        return _
      }
    }
  }, [controlState, onTimerStarted, onTimerPaused, onTimerStopped])

  useEffect(() => {
    if (isCountdownActive && displaySeconds === 0) {
      stopCountdown()
      setControlState('toStop')
    }
  }, [isCountdownActive, displaySeconds, stopCountdown])

  return {
    state: {
      time: toTimeString(displaySeconds),
      controller: controlState,
    },
    action: {
      updateInitialSeconds,
      controlTimer,
    },
  }
}

function toTimeString(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  const format = (n: number) => String(n).padStart(2, '0')
  return `${format(h)}:${format(m)}:${format(s)}`
}

function toSeconds(timeString: string) {
  const [h, m, s] = timeString.split(':').map(Number)
  if (h !== undefined && m !== undefined && s !== undefined) {
    return h * 3600 + m * 60 + s
  }
  return null
}
