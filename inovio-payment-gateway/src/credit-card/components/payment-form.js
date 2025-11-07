/**
 * Inovio Credit Card Payment Form Component
 *
 * Renders the credit card payment form and handles data submission for WooCommerce Blocks.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

import { useState, useEffect } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { ValidatedTextInput } from '@woocommerce/blocks-checkout';

const { getSetting } = window.wc.wcSettings;
const settings = getSetting( 'inoviodirectmethod_data', {} );

/**
 * Payment Form Component
 *
 * @param {Object} props Component props
 * @param {Object} props.eventRegistration Event registration object
 * @param {Object} props.emitResponse Response emitter
 * @return {JSX.Element} Payment form
 */
export const PaymentForm = ( props ) => {
    const { eventRegistration, emitResponse } = props;
    const { onPaymentSetup } = eventRegistration;

    const [cardNumber, setCardNumber] = useState( '' );
    const [cardExpiry, setCardExpiry] = useState( '' );
    const [cardCvv, setCardCvv] = useState( '' );

    /**
     * Register payment processing handler
     */
    useEffect( () => {
        const unsubscribe = onPaymentSetup( () => {
            return {
                type: emitResponse.responseTypes.SUCCESS,
                meta: {
                    paymentMethodData: {
                        card_number: cardNumber.replace( /\D/g, '' ),
                        card_expiry: cardExpiry,
                        card_cvv: cardCvv.replace( /\D/g, '' ),
                    },
                },
            };
        } );

        return () => unsubscribe();
    }, [ onPaymentSetup, cardNumber, cardExpiry, cardCvv, emitResponse.responseTypes.SUCCESS ] );

    /**
     * Handle numeric input (remove non-digits)
     *
     * @param {Event} e Input event
     * @return {string} Numeric only string
     */
    const handleNumericInput = ( e ) => {
        return e.target.value.replace( /\D/g, '' );
    };

    /**
     * Format card number with spaces (XXXX XXXX XXXX XXXX)
     *
     * @param {string} value Card number
     * @return {string} Formatted card number
     */
    const formatCardNumber = ( value ) => {
        const cleaned = value.replace( /\D/g, '' );
        const formatted = cleaned.match( /.{1,4}/g );
        return formatted ? formatted.join( ' ' ) : cleaned;
    };

    return (
        <div className="wc-block-components-text">
            { settings.description && (
                <p>{ decodeEntities( settings.description ) }</p>
            ) }

            <>
                <ValidatedTextInput
                    id="inovio-card-number"
                    type="text"
                    label="Card Number"
                    value={ formatCardNumber( cardNumber ) }
                    onChange={ ( newValue ) => setCardNumber( newValue.replace( /\D/g, '' ) ) }
                    required
                    autoComplete="cc-number"
                    className="wc-credit-card-form-card-number"
                />

                <ValidatedTextInput
                    id="inovio-card-expiry"
                    type="text"
                    label="Expiry (MMYYYY)"
                    value={ cardExpiry }
                    onChange={ ( newValue ) => setCardExpiry( newValue.replace( /\D/g, '' ).substring( 0, 6 ) ) }
                    required
                    autoComplete="cc-exp"
                    className="wc-credit-card-form-card-expiry"
                    maxLength={ 6 }
                />

                <ValidatedTextInput
                    id="inovio-card-cvv"
                    type="text"
                    label="CVV"
                    value={ cardCvv }
                    onChange={ ( newValue ) => setCardCvv( newValue.replace( /\D/g, '' ) ) }
                    required
                    autoComplete="cc-csc"
                    className="wc-credit-card-form-card-cvc"
                />
            </>
        </div>
    );
};
