import { Container, Stack, Title, Text, Button, Image, Card, Box } from '@mantine/core';
import { ThemeToggle } from '../components/ThemeToggle';

export default function ThankYouPage() {
  return (
    <Container size="sm" py="xl">
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Box pos="relative">
          <Box pos="absolute" top={0} right={0}>
            <ThemeToggle />
          </Box>
          <Stack align="center" gap="xl">
            <Image
              src="https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg"
              alt="Equal Experts"
              h={60}
              w="auto"
            />

          <Title order={1} ta="center" c="equalBlue.4">
            Thank You!
          </Title>

          <Text size="lg" ta="center">
            Your feedback has been submitted successfully.
          </Text>

          <Text size="md" c="dimmed" ta="center">
            Your responses will help us improve future conferences. We genuinely
            appreciate you taking the time to share your thoughts.
          </Text>

          <Text size="md" ta="center" fw={500} mt="md">
            Results will be available after the conference
          </Text>

          <Text size="sm" ta="center" c="dimmed">
            To access results, visit:{' '}
            <a
              href="https://www.equalexperts.com/nam-conference-results"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1795d4', textDecoration: 'underline' }}
            >
              equalexperts.com/nam-conference-results
            </a>
          </Text>

          <Card
            mt="xl"
            padding="lg"
            radius="md"
            withBorder
            style={{ backgroundColor: 'var(--mantine-color-gray-light)' }}
          >
            <Stack gap="md">
              <Title order={3} size="h4" ta="center">
                How we'll use your feedback
              </Title>

              <Text size="sm">
                Your responses go directly to the conference organizing team, who review every
                submission to understand what worked well and what could be better.
              </Text>

              <Text size="sm">
                Within a few weeks after the conference, the team will analyze all feedback and
                identify common themes and specific suggestions. This analysis directly shapes
                decisions for future conferences—from session formats and networking opportunities
                to venue choices and scheduling.
              </Text>

              <Text size="sm">
                We're committed to transparency. You'll be able to see the results and our action
                plan at the link above. Thank you for helping us create better conference
                experiences.
              </Text>
            </Stack>
          </Card>

          <Button
            variant="filled"
            color="equalBlue"
            size="lg"
            component="a"
            href="https://www.equalexperts.com"
          >
            Return to Conference Site
          </Button>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}