import { ActionIcon, Box, Card, Center, Group, Tooltip } from '@mantine/core'
import { TimeInput, type TimeInputProps } from '@mantine/dates'
import { useDisclosure, useInterval } from '@mantine/hooks'
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconStopwatch,
  IconX,
} from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'

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

function TimeIndicator({ close }: TimeIndicatorProps) {
  const { uiState, action } = useTimer()

  const handleInputChanged = useCallback<
    Exclude<TimeInputProps['onChange'], undefined>
  >(
    (e) => {
      action.onInitialSecondsChanged(e.target.value)
    },
    [action],
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
            value={uiState.time}
            withSeconds
          />
          <Tooltip label={uiState.isRunning ? '一時停止' : '開始'}>
            <ActionIcon
              size='md'
              variant='subtle'
              color={uiState.isRunning ? 'red' : 'teal'}
              onClick={action.toggleCountdown}
            >
              {uiState.isRunning ? (
                <IconPlayerPauseFilled />
              ) : (
                <IconPlayerPlayFilled />
              )}
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

  const onInitialSecondsChanged = useCallback((input: string) => {
    const s = toSeconds(input)
    if (s !== null) {
      setDisplaySeconds(s)
      setInitialSeconds(s)
    }
  }, [])

  const countdown = useInterval(() => {
    setDisplaySeconds((s) => s - 1)
  }, 1000)

  useEffect(() => {
    if (countdown.active && displaySeconds === 0) {
      countdown.stop()
      setDisplaySeconds(initialSeconds)
    }
  }, [displaySeconds, countdown, initialSeconds])

  return {
    uiState: {
      time: toTimeString(displaySeconds),
      isRunning: countdown.active,
    },
    action: {
      onInitialSecondsChanged,
      toggleCountdown: countdown.toggle,
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
