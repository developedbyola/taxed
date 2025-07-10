import React from 'react';
import { Box, Heading, Separator, Text, VStack, List } from '@chakra-ui/react';

const Isocon = () => {
  return (
    <svg
      width='120'
      height='120'
      viewBox='0 0 100 123'
      fill='#229EFF'
      xmlns='http://www.w3.org/2000/svg'
      stroke-width='2px'
      stroke-linecap='round'
      stroke-linejoin='round'
      style={{ marginInline: 'auto' }}
    >
      <path
        d='M67.11 87.8529L77.71 117.863L72.6399 120.753L51.0099 95.6329L39.9099 101.963L28.7999 82.8129L13.11 73.7529V55.7429L2 36.5929L13.11 30.2629V12.2529L28.7999 21.3129L33.11 18.8529L39.9099 14.9829L51.0099 34.1329L66.7 43.1929V61.2029L77.8099 80.3529L66.7 86.6829L67.11 87.8529Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M48.0803 10.8929L39.9103 14.9829L33.1104 18.8529L28.8003 21.3129L13.1104 12.2529L33.1104 2.25293L48.0803 10.8929Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M71.0101 24.1324L51.0101 34.1324L39.9102 14.9824L48.0802 10.8925L59.9102 4.98242L71.0101 24.1324Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M86.6998 33.1927L66.6998 43.1927L51.0098 34.1328L71.0098 24.1328L86.6998 33.1927Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M86.7002 33.1934V51.2034L66.7002 61.2034V43.1934L86.7002 33.1934Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M97.8102 70.3531L77.8102 80.3531L66.7002 61.2031L86.7002 51.2031L97.8102 70.3531Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M97.7102 107.863L92.4302 110.503L77.7102 117.863L67.1102 87.8527L66.7002 86.6826L86.7002 76.6826L97.7102 107.863Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M97.7097 107.863L92.6396 110.753L72.6396 120.753L77.7097 117.863L92.4297 110.503L97.7097 107.863Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M97.8102 70.3525L86.7002 76.6825L66.7002 86.6825L77.8102 80.3525L97.8102 70.3525Z'
        stroke='white'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export const About = () => {
  return (
    <React.Fragment>
      <Box py={4}>
        <VStack
          gap={0}
          mt={12}
        >
          <Isocon />
          <Heading
            mt={4}
            fontSize={16}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            About Taxed
          </Heading>
          <Text
            mt={1}
            mx='auto'
            fontSize={13}
            maxWidth='21rem'
            color='gray.500'
            textAlign={'center'}
          >
            Empowering individuals and businesses to manage and pay their taxes
            securely, accurately, and conveniently from anywhere.
          </Text>
        </VStack>

        <Separator
          my={5}
          color='gray.100'
        />

        <VStack
          px={5}
          gap={6}
          align='stretch'
        >
          <Box>
            <Heading
              size='md'
              mb={3}
              fontSize={14}
              color='gray.700'
            >
              Our Mission
            </Heading>
            <Text
              color='gray.600'
              fontSize={13}
              lineHeight='tall'
            >
              Across Nigeria, many taxpayers face challenges in meeting tax
              obligations due to complex processes, unclear deadlines, and long
              queues. We created Taxed to bridge this gap by providing a simple,
              secure, and transparent digital solution that makes tax payment
              easy, compliant, and stress-free.
            </Text>
          </Box>

          <Box>
            <Heading
              size='md'
              mb={3}
              fontSize={14}
              color='gray.700'
            >
              What We Offer
            </Heading>
            <List.Root
              spaceY={2}
              px={5}
            >
              {[
                'Seamless Tax Payments: Pay your federal, state, and local taxes electronically in minutes.',
                'Smart Reminders: Get timely notifications to avoid late payments and penalties.',
                'Secure Transactions: Your data and payments are protected with industry-standard encryption and security practices.',
                'Payment History Tracking: Access receipts and transaction history anytime, helping you stay organized for personal records or business audits.',
                'User-Friendly Experience: No complex forms or guesswork—just a clear, guided process from calculation to payment.',
              ].map((item, index) => (
                <List.Item
                  key={index}
                  fontSize={13}
                  color='gray.600'
                >
                  <Text
                    as='span'
                    fontSize={13}
                    fontWeight='medium'
                  >
                    {item.split(':')[0]}:
                  </Text>{' '}
                  {item.split(':').slice(1).join(':').trim()}
                </List.Item>
              ))}
            </List.Root>
          </Box>

          <Box>
            <Heading
              size='md'
              mb={3}
              fontSize={14}
              color='gray.700'
            >
              Our Vision
            </Heading>
            <Text
              color='gray.600'
              fontSize={13}
              lineHeight='tall'
            >
              To build a financially responsible society where individuals and
              businesses can manage their tax obligations confidently and
              efficiently using technology.
            </Text>
          </Box>

          <Box>
            <Heading
              size='md'
              mb={3}
              fontSize={14}
              color='gray.700'
            >
              Our Values
            </Heading>
            <List.Root
              px={5}
              spaceY={2}
            >
              {[
                'Simplicity: We design our platform to be intuitive and accessible for everyone.',
                'Transparency: We keep fees clear, processes open, and communication direct.',
                'Reliability: We ensure your payments are processed safely, correctly, and on time.',
                'Empowerment: We equip users with tools to take control of their tax responsibilities.',
              ].map((item, index) => (
                <List.Item
                  key={index}
                  fontSize={13}
                  color='gray.600'
                >
                  <Text
                    as='span'
                    fontSize={13}
                    fontWeight='medium'
                  >
                    {item.split(':')[0]}:
                  </Text>{' '}
                  {item.split(':').slice(1).join(':').trim()}
                </List.Item>
              ))}
            </List.Root>
          </Box>

          <Box>
            <Heading
              size='md'
              mb={3}
              fontSize={14}
              color='gray.700'
            >
              Contact Us
            </Heading>
            <Text
              color='gray.600'
              fontSize={13}
              mb={2}
            >
              Have questions or need support? Our team is ready to assist you.
            </Text>
            <VStack
              align='flex-start'
              spaceY={1}
              fontSize={13}
              color='gray.600'
            >
              <Text>📧 support@taxed.ng</Text>
              <Text>📞 +234 800 000 0000</Text>
              <Text>🌐 https://taxed.ng</Text>
            </VStack>
          </Box>
        </VStack>

        <Box
          mt={8}
          px={5}
        >
          <Text
            mx='auto'
            color='gray.500'
            fontSize={12}
            textAlign='center'
            maxWidth='20rem'
            fontStyle='italic'
          >
            Taxed: Simplifying tax payments so you can focus on what truly
            matters.
          </Text>
        </Box>
      </Box>
    </React.Fragment>
  );
};
