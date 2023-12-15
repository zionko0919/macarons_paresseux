import {
  Card, Text, Strong, Flex, Box, Theme,
} from '@radix-ui/themes';
import WarningSign from './ImagesForEventComponents/warning_sign.png';

function WeAreNotRealCard() {
  return (
    <Theme accentColor="crimson" radius="full" scaling="105%" appearance="light">
      <Card size="4" style={{ maxWidth: 800 }} variant="surface">
        <Flex gap="5" align="center">
          <img
            src={WarningSign}
            alt="Warning Sign"
            style={{
              display: 'block',
              objectFit: 'cover',
              width: '20%',
            }}
          />
          <Box>
            <Text as="p" size="5" color="red">
              <Strong>Disclaimer:</Strong>
            </Text>
            <Text as="p" size="3">
              The content and information provided on this website are for demonstration purposes
              only. Everything on this site, including but not limited to products, services, and
              any associated data, is not real and is intended solely to showcase the functionality
              of a React application.
            </Text>
            <Text as="p" size="3">
              Any resemblance to real products, services, or entities is purely coincidental.
              This website does not offer genuine products or services for purchase or use.
            </Text>
            <Text as="p" size="3">
              The creator of this website is not responsible for any misunderstandings, confusion,
              or misuse arising from the content presented. Visitors are encouraged to treat the
              entire website as a simulation and not as a representation of real-world entities.
            </Text>
            <Text as="p" size="3">
              Thank you for your understanding.
            </Text>
          </Box>
        </Flex>
      </Card>
    </Theme>
  );
}

export default WeAreNotRealCard;
