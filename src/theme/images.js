let Images = {};

let called = false;
export const useImages = (images = {}) => {
  if (called) {
    console.log('============================');
    console.log('= useImages already called =');
    console.log('============================');
    return;
  }
  called = true;
  Object.assign(Images, images);
};

export default Images;
