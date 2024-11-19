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
  const [isClockVisible, { open: openClock, close: closeClock }] =
    useDisclosure()

  const handleIconClicked = useCallback(() => {
    openClock()
  }, [openClock])

  if (isClockVisible) {
    return <TimeIndicator close={closeClock} />
  }

  return (
    <Group>
      <Tooltip label='タイマー'>
        <ActionIcon size='lg' variant='default' onClick={handleIconClicked}>
          <IconStopwatch />
        </ActionIcon>
      </Tooltip>
    </Group>
  )
}

type TimeIndicatorProps = {
  close: () => void
}

function TimeIndicator({ close }: TimeIndicatorProps) {
  const [initialSeconds, setInitialSeconds] = useState(0)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const countdown = useInterval(() => setRemainingSeconds((s) => s - 1), 1000)
  const handlePlayClicked = useCallback(() => {
    countdown.start()
  }, [countdown])
  const handlePauseClicked = useCallback(() => {
    countdown.stop()
  }, [countdown])

  useEffect(() => {
    if (countdown.active && remainingSeconds === 0) {
      countdown.stop()
      setRemainingSeconds(initialSeconds)
    }
  }, [remainingSeconds, countdown, initialSeconds])

  const handleInputChanged = useCallback<
    Exclude<TimeInputProps['onChange'], undefined>
  >((e) => {
    const seconds = toSeconds(e.currentTarget.value)
    if (seconds !== null) {
      setInitialSeconds(seconds)
      setRemainingSeconds(seconds)
    }
  }, [])

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
            value={toTimeString(remainingSeconds)}
            withSeconds
          />
          <Tooltip label={countdown.active ? '一時停止' : '開始'}>
            <ActionIcon
              size='md'
              variant='subtle'
              color={countdown.active ? 'red' : 'teal'}
              onClick={
                countdown.active ? handlePauseClicked : handlePlayClicked
              }
            >
              {countdown.active ? (
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
