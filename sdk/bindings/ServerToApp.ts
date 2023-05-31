// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { AckMessage } from "./AckMessage";
import type { ErrorMessage } from "./ErrorMessage";
import type { InitializeResponse } from "./InitializeResponse";
import type { RequestRejected } from "./RequestRejected";
import type { SignMessagesResponse } from "./SignMessagesResponse";
import type { SignTransactionsResponse } from "./SignTransactionsResponse";
import type { UserConnectedEvent } from "./UserConnectedEvent";
import type { UserDisconnectedEvent } from "./UserDisconnectedEvent";

export type ServerToApp = { type: "InitializeResponse" } & InitializeResponse | { type: "UserConnectedEvent" } & UserConnectedEvent | { type: "UserDisconnectedEvent" } & UserDisconnectedEvent | { type: "SignTransactionsResponse" } & SignTransactionsResponse | { type: "SignMessagesResponse" } & SignMessagesResponse | { type: "RequestRejected" } & RequestRejected | { type: "ErrorMessage" } & ErrorMessage | { type: "AckMessage" } & AckMessage;