export interface ServiceModelDTO {
  id: string;
  name: string;
  description: string;
  icon_svg_base64: string;
}

export interface ServiceModeWithAuthorizationDTO extends ServiceModelDTO {
  is_authorized: boolean;
}
