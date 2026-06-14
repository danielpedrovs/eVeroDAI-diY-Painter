import { session } from "../core/session.js";

export function invoiceHandler(message) {

  switch (session.invoiceStep) {

    case 1:
      session.invoiceData.customerName = message;
      session.invoiceStep = 2;
      return "What is the customer's address?";

    case 2:
      session.invoiceData.customerAddress = message;
      session.invoiceStep = 3;
      return "What work was completed?";

    case 3:
      session.invoiceData.description = message;
      session.invoiceStep = 4;
      return "What is the invoice amount?";

    case 4:
      session.invoiceData.amount = message;
      session.invoiceStep = 5;

      return `
Invoice Summary

Customer: ${session.invoiceData.customerName}

Address: ${session.invoiceData.customerAddress}

Work: ${session.invoiceData.description}

Amount: £${session.invoiceData.amount}

Type YES to continue.
`;

    case 5:

      if (message.toLowerCase() === "yes") {

        session.activeFlow = null;
        session.invoiceStep = 0;

        return "Invoice generation coming next step ✅";
      }

      return "Please type YES to continue.";
  }

}