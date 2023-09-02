function Title(titles) {
  const [title, setTitle] = useState('')

  useEffect((titles) => {
    setTitle(titles)
  }, [])

  return (
    <h1>{title}</h1>
  )
}