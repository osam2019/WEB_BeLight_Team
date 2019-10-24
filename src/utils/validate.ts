/* Define BeLightValidate Interface */
interface BeLightValidateInterface {
  replaceSpace(text: string): string;
}

class BeLightValidate implements BeLightValidateInterface {
  constructor() {}
  public replaceSpace(text: string) {
    return text.replace(/\r\n/gi, "");
  }
}

export default new BeLightValidate();
