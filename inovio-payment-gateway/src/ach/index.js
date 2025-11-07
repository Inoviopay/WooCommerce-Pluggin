/**
 * Inovio ACH Payment Method - WooCommerce Blocks
 *
 * Registers the Inovio ACH payment method with WooCommerce Blocks.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

import { decodeEntities } from '@wordpress/html-entities';
import { PaymentForm } from './components/payment-form';

const { getSetting } = window.wc.wcSettings;
const settings = getSetting( 'achinoviomethod_data', {} );

/**
 * Label component
 *
 * @param {Object} props Component props
 * @return {JSX.Element} Label component
 */
const Label = ( props ) => {
    const { PaymentMethodLabel } = props.components;
    const label = decodeEntities( settings.title || 'ACH Bank Payment (Inovio)' );

    return <PaymentMethodLabel text={ label } />;
};

/**
 * Content component (displays when payment method is selected)
 *
 * @param {Object} props Component props
 * @return {JSX.Element} Payment form component
 */
const Content = ( props ) => {
    return <PaymentForm { ...props } />;
};

/**
 * ACH payment method configuration
 */
export const achMethod = {
    name: 'achinoviomethod',
    label: <Label />,
    content: <Content />,
    edit: <Content />,
    canMakePayment: () => true,
    ariaLabel: decodeEntities( settings.title || 'ACH Bank Payment (Inovio)' ),
    supports: {
        features: settings.supports || [],
    },
};
