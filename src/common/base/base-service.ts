export interface IBaseService<I, O> {
  execute(props: I): Promise<O>;
}
