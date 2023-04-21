export default interface ErrorResponseJson {
  meta: {type: 'httpresponse'; version: '2.0' | '2.1'};
  message: string;
  code: number;
  service: string;
}
