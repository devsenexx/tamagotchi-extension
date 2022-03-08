export default abstract class Component {
  awake?: () => void
  abstract update(): void
}
