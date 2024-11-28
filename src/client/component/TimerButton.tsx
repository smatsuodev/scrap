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
import { useDisclosure, useInterval } from '@mantine/hooks'
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
  useState,
} from 'react'

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
      action.onInitialSecondsChanged(e.target.value)
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

  return (
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
            <ActionIcon color='gray' size='md' variant='subtle' onClick={close}>
              <IconX onClick={close} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Center>
    </Card>
  )
}

function useTimer() {
  const [initialSeconds, setInitialSeconds] = useState(0)
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const [controlState, setControlState] = useState<TimerControlState>('toStart')

  const onInitialSecondsChanged = useCallback(
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

  const countdown = useInterval(() => {
    setDisplaySeconds((s) => s - 1)
  }, 1000)

  const onTimerStarted = useCallback(() => {
    countdown.start()
    setControlState('toPause')
  }, [countdown])
  const onTimerPaused = useCallback(() => {
    countdown.stop()
    setControlState('toStart')
  }, [countdown])
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
    if (countdown.active && displaySeconds === 0) {
      countdown.stop()
      setControlState('toStop')
    }
  }, [displaySeconds, countdown])

  return {
    state: {
      time: toTimeString(displaySeconds),
      controller: controlState,
    },
    action: {
      onInitialSecondsChanged,
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
