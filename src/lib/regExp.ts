class RegExp {
  private firstLetter = /^[A-Za-z]{1}/;
  private id = /^[A-Za-z]{1}[A-Za-z0-9]{3,16}$/; //첫 단어는 영어로, 영어와 숫자 3~16자리
  private password = /^.*(?=^.{6,15}$)(?=.*\d)(?=.*[a-zA-Z]).*$/; //비밀번호는 영문과 숫자를 포함하여 6~15자리
  private username = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,20}$/; //2~20자리
  private email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  public SignUp(
    id: string,
    password: string,
    username: string,
    email: string
  ): boolean {
    if (
      this.id.test(id) &&
      this.password.test(password) &&
      this.username.test(username) &&
      this.email.test(email)
    ) {
      return false;
    }
    return true;
  }
  public Id(
    id: string,
  ): boolean {
     return  this.id.test(id) == true ? false: true
  }
  public Pwd(
    password: string,
  ): boolean {
     return  this.password.test(password) == true ? false: true
  }
  public Email(
    email: string,
  ): boolean {
     return  this.email.test(email) == true ? false: true
  }
  public Username(
    username: string,
  ): boolean {
     return  this.username.test(username) == true ? false: true
  }
  public SignIn(id: string, password: string): boolean {
    if (this.id.test(id) && this.password.test(password)) {
      return false;
    } else {
      return true;
    }
  }
}

export default new RegExp();
