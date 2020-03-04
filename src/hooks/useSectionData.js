const useSectionData = (items) => {
  const data = [];
  items.forEach(item => {
    data.push({
      title: item,
      data: [item]
    });
  });

  return data;
}

export default useSectionData;
