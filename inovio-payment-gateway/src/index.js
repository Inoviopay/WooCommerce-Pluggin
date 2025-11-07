/**
 * Inovio Payment Gateway - WooCommerce Blocks Integration
 *
 * Main entry point for registering Inovio payment methods with WooCommerce Blocks.
 *
 * @package Inovio_Payment_Gateway
 * @since 6.0.0
 */

import { registerPaymentMethod } from '@woocommerce/blocks-registry';
import { creditCardMethod } from './credit-card';
import { achMethod } from './ach';

// Register Credit Card payment method
registerPaymentMethod( creditCardMethod );

// Register ACH payment method
registerPaymentMethod( achMethod );
