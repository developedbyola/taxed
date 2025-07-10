import React from 'react';
import { Box, Heading, Separator, Text, VStack } from '@chakra-ui/react';

const IsoCon = () => {
  return (
    <svg
      width='120'
      height='120'
      viewBox='0 0 90 127'
      fill='#229EFF'
      xmlns='http://www.w3.org/2000/svg'
      stroke-width='1px'
      stroke-linecap='round'
      stroke-linejoin='round'
    >
      <path
        d='M35.4805 58.5901L30.2105 61.2201L22.4905 65.5401L19.2905 67.3501L14.2305 58.6101L30.7105 50.3701L35.4805 58.5901Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M64.5802 47.9L50.2902 39.65L50.1302 39.56L22.4902 23.6L2.49023 12.04V86.66L67.5102 124.2V49.59L64.5802 47.9ZM22.4902 53.91L30.2102 49.51L30.7102 50.38L35.4802 58.59L37.4402 61.97L50.7202 54.4L55.7702 63.13L37.4402 73.68L36.5602 72.16L32.7202 65.55L30.2102 61.22L22.4902 65.55L19.2902 67.35L14.2302 58.62L22.4902 53.91ZM9.71023 82.54V77.25L15.9402 73.7L16.3402 73.93L21.2602 76.77L23.6202 78.13L12.7802 84.31L9.71023 82.54ZM19.3802 88.12L30.2102 81.94L30.9202 82.35L37.8902 86.37L27.0502 92.55L19.3802 88.12ZM32.8302 95.9L43.6702 89.72L44.3802 90.13L51.3502 94.15L40.5102 100.33L32.8302 95.9ZM60.2902 104.6L54.0602 108.15L46.3802 103.72L57.2202 97.54L57.9302 97.95L60.2902 99.31V104.6Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M57.9304 97.94L46.3804 103.72L57.2204 97.54L57.9304 97.94Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M60.2904 99.2999V104.6L54.0604 108.15L46.3804 103.72L57.9304 97.9399L60.2904 99.2999Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M44.3801 90.1202L32.8301 95.9002L43.6701 89.7202L44.3801 90.1202Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M51.3501 94.1501L40.5101 100.33L32.8301 95.9001L44.3801 90.1201L51.3501 94.1501Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M30.9204 82.3499L19.3804 88.1199L30.2104 81.9399L30.9204 82.3499Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M37.8904 86.3701L27.0504 92.5501L19.3804 88.1201L30.9204 82.3501L37.8904 86.3701Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M23.6204 78.1403L12.7804 84.3103L9.71045 82.5403L21.2605 76.7803L23.6204 78.1403Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M21.2605 76.7802L9.71045 82.5402V77.2502L16.3404 73.9302L21.2605 76.7802Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M55.7704 63.1199L37.4405 73.6699L36.5604 72.1599L32.7204 65.5399L30.2104 61.2199L35.4805 58.5899L37.4405 61.9699L50.7204 54.3999L55.7704 63.1199Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M30.7105 50.37L14.2305 58.61L22.4905 53.91L30.2105 49.5L30.7105 50.37Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M87.5102 39.59L72.3302 47.17L67.5102 49.59L64.5802 47.9L50.2902 39.65L50.2102 39.5L50.1302 39.55L22.4902 23.6L2.49023 12.04L22.4902 2.04004L87.5102 39.59Z'
        stroke='white'
        stroke-linejoin='round'
      />
      <path
        d='M87.5103 39.5898V114.21L67.5103 124.21V49.5898L72.3303 47.1698L87.5103 39.5898Z'
        stroke='white'
        stroke-linejoin='round'
      />
    </svg>
  );
};

export const Terms = () => {
  return (
    <React.Fragment>
      <Box py={4}>
        <VStack
          gap={0}
          mt={12}
        >
          <IsoCon />
          <Heading
            mt={4}
            fontSize={16}
            textAlign={'center'}
            letterSpacing={'-1%'}
          >
            Terms of use
          </Heading>
          <Text
            mt={1}
            mx='auto'
            fontSize={13}
            maxWidth='21rem'
            color='gray.500'
            textAlign={'center'}
          >
            Welcome to Taxed (“we” or “us”). By accessing or using our e-tax
            payment application, you agree to these Terms of Use.
          </Text>
        </VStack>

        <Separator
          my={6}
          color='gray.100'
        />

        <Box
          spaceY={5}
          px={5}
        >
          <Box>
            <Heading fontSize={14}>1. Acceptance of Terms</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              By creating an account, accessing, or using our App, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our Privacy Policy.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>2. Eligibility</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              You must be at least 18 years old and legally capable of entering
              into contracts to use our App. By using the App, you confirm that
              you meet these requirements.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>3. User Responsibilities</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              You agree to:
            </Text>
            <ul
              style={{
                gap: 6,
                marginTop: 6,
                display: 'flex',
                paddingInline: 20,
                listStyleType: 'disc',
                flexDirection: 'column',
              }}
            >
              <li>
                <Text
                  fontSize={13}
                  color='gray.500'
                >
                  Provide accurate, current, and complete information during
                  registration and when using the Service.
                </Text>
              </li>
              <li>
                <Text
                  fontSize={13}
                  color='gray.500'
                >
                  Keep your login credentials secure and notify us immediately
                  if you suspect unauthorized access to your account.
                </Text>
              </li>
              <li>
                <Text
                  fontSize={13}
                  color='gray.500'
                >
                  Use the App in compliance with applicable local, state, and
                  federal tax laws.
                </Text>
              </li>
              <li>
                <Text
                  fontSize={13}
                  color='gray.500'
                >
                  Be solely responsible for the accuracy of all information
                  provided and for any tax filings or payments made through the
                  App.
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Heading fontSize={14}>4. Tax Advice</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              The App is designed to facilitate tax payments and does not
              constitute legal, financial, or tax advice. We recommend
              consulting with a qualified tax professional for advice specific to
              your situation.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>5. Payment Processing</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              All payments processed through the App are subject to our
              processing partners' terms and conditions. We are not responsible
              for any fees, penalties, or interest charges that may be assessed
              by tax authorities.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>6. Prohibited Activities</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              You agree not to:
            </Text>
            <ul
              style={{
                gap: 6,
                marginTop: 6,
                display: 'flex',
                paddingInline: 20,
                listStyleType: 'disc',
                flexDirection: 'column',
              }}
            >
              <li>
                <Text fontSize={13} color='gray.500'>
                  Use the App for fraudulent, illegal, or abusive activities.
                </Text>
              </li>
              <li>
                <Text fontSize={13} color='gray.500'>
                  Interfere with or disrupt the App's security, networks, or connected systems.
                </Text>
              </li>
              <li>
                <Text fontSize={13} color='gray.500'>
                  Attempt to reverse engineer, decompile, or hack any part of the App.
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Heading fontSize={14}>7. Intellectual Property</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              All content, trademarks, logos, and software used within the App are the property of Taxed or its licensors and are protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the App solely for your personal use.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>8. Disclaimers</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              We provide the App "as is" and "as available" without warranties of any kind. We do not guarantee that the App will be error-free or uninterrupted. We do not assume responsibility for errors in your tax filings or payment amounts.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>9. Limitation of Liability</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              To the fullest extent permitted by law, Taxed will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the App, including but not limited to loss of data, tax penalties, or payment issues.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>10. Termination</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              We may suspend or terminate your account or access to the App at our discretion if you violate these Terms or engage in suspicious activity. You may terminate your account at any time by contacting our support team.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>11. Changes to Terms</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              We may update these Terms occasionally. We will notify you of any material changes, and continued use of the App after changes take effect constitutes your acceptance of the updated Terms.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>12. Governing Law</Heading>
            <Text
              fontSize={13}
              color='gray.500'
            >
              These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to its conflict of laws principles.
            </Text>
          </Box>
          <Box>
            <Heading fontSize={14}>13. Contact Us</Heading>
            <Text
              fontSize={13}
              color='gray.500'
              mb={2}
            >
              For questions regarding these Terms, please contact us at:
            </Text>
            <Text fontSize={13} color='gray.500'>
              Taxed
              <br />
              support@taxed.ng
              <br />
              +234 800 000 0000
            </Text>
          </Box>
          <Box mt={8}>
            <Text
              fontSize={13}
              color='gray.500'
              fontWeight='medium'
              textAlign='center'
            >
              By using Taxed, you acknowledge that you have read, understood, and agree to these Terms of Use.
            </Text>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};
