import React from 'react';
import { observer } from 'mobx-react-lite';

const PrivacyPolicy = observer(() => {
    return (
        <div className='privacy-policy'>
            <h1>Privacy Policy for BinaryTool</h1>
            <p><strong>1. Introduction</strong></p>
            <p>BinaryTool, powered by Deriv,We operates the BinaryTool app (the “App”).</p>

            <p><strong>2. Information Collection and Use</strong></p>
            <p>We do not collect any personal and sensitive user data. However, we may collect non-personal data, such as app usage statistics, to improve the user experience.</p>

            <p><strong>3. Data Handling Procedures</strong></p>
            <p>All data collected is stored securely and is only accessible by authorized personnel.</p>

            <p><strong>4. Data Retention and Deletion</strong></p>
            <p>Non-personal data is retained for analysis purposes. No personal data is collected or stored.</p>

            <p><strong>5. Sharing of Data</strong></p>
            <p>We do not share any personal or sensitive user data with third parties.</p>

            <p><strong>6. Privacy Point of Contact</strong></p>
            <p>For any privacy-related inquiries, please contact us at <a href="mailto:binarytoolsite@gmail.com">binarytoolsite@gmail.com</a>.</p>

            <p><strong>7. Changes to This Privacy Policy</strong></p>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

            <p><strong>8. Contact Us</strong></p>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:binarytoolsite@gmail.com">binarytoolsite@gmail.com</a>.</p>
        </div>
    );
});

export default PrivacyPolicy;