export const UserConstraints = {
  userName: {
    minLength: 3,
    maxLength: 50,
  },
  email: {
    minLength: 3,
    maxLength: 255,
  },
  password: {
    minLength: 5,
    maxLength: 25,
  },
};

export const PaginationDefaults = {
  startingPage: 1,
  recordsPerPageLimit: 10,
};

export const DefaultValues = {
  zero: 0,
};
